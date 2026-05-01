package com.tlcn.fashion_api.service.review;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.dto.review.CreateReviewRequest;
import com.tlcn.fashion_api.dto.review.TestimonialDto;
import com.tlcn.fashion_api.dto.response.review.ReviewResponse;
import com.tlcn.fashion_api.mapper.review.ReviewMapper;
import com.tlcn.fashion_api.entity.media.Media;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.review.Review;
import com.tlcn.fashion_api.entity.review.ReviewMedia;
import com.tlcn.fashion_api.entity.review.ReviewMediaId;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.message.MediaRepository;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.review.ReviewMediaRepository;
import com.tlcn.fashion_api.repository.review.ReviewRepository;
import com.tlcn.fashion_api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final MediaRepository mediaRepository;
    private final ReviewMediaRepository reviewMediaRepository;
    private final CloudinaryService cloudinaryService;

    private static final int MAX_IMAGES = 5;
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request, List<MultipartFile> images) {
        Long userId = SecurityUtils.getCurrentUserId();

        // 1. Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // 2. Kiểm tra user đã mua sản phẩm này chưa (status = COMPLETED)
        boolean hasPurchased = orderItemRepository.existsByUserIdAndProductIdAndOrderStatusCompleted(
                userId, request.getProductId());

        if (!hasPurchased) {
            throw new BadRequestException("You can only review products you have purchased and received (status: COMPLETED)");
        }

        // 3. Đếm số lần mua COMPLETED và số lần đã review
        long purchaseCount = orderItemRepository.countPurchasesByUserIdAndProductIdAndOrderStatusCompleted(
                userId, request.getProductId());
        long reviewCount = reviewRepository.countByUserIdAndProductId(userId, request.getProductId());

        // 4. Kiểm tra: số lần review không được vượt quá số lần mua COMPLETED
        if (reviewCount >= purchaseCount) {
            throw new BadRequestException(
                    String.format("You have already reviewed this product %d time(s). " +
                                    "You can only review once for each completed purchase. " +
                                    "You have %d completed purchase(s) for this product.",
                            reviewCount, purchaseCount)
            );
        }

        // 5. Validate và upload ảnh
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            if (images.size() > MAX_IMAGES) {
                throw new BadRequestException("Maximum " + MAX_IMAGES + " images allowed");
            }

            for (MultipartFile image : images) {
                if (image.isEmpty()) continue;

                // Validate file size
                if (image.getSize() > MAX_IMAGE_SIZE) {
                    throw new BadRequestException("Image size must be less than 5MB");
                }

                // Validate file type
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new BadRequestException("Only image files are allowed");
                }

                // Upload to Cloudinary
                String imageUrl = cloudinaryService.uploadFile(image, "review-images");
                if (imageUrl != null) {
                    imageUrls.add(imageUrl);
                }
            }
        }

        // 6. Tạo Review mới (mỗi lần mua COMPLETED được review 1 lần)
        User user = User.builder().id(userId).build();
        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setContentText(request.getContent());
        review.setStatus("pending"); // Chờ admin xác nhận
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        // 7. Tạo Media và ReviewMedia cho từng ảnh
        if (!imageUrls.isEmpty()) {
            int sortOrder = 0;
            for (String imageUrl : imageUrls) {
                // Tạo Media entity
                Media media = new Media();
                media.setUrl(imageUrl);
                media.setOwner(user);
                media.setCreatedBy(user);
                media.setMimeType("image/jpeg"); // Default, có thể cải thiện sau
                media.setProvider("cloudinary");
                media.setCreatedAt(LocalDateTime.now());

                Media savedMedia = mediaRepository.save(media);

                // Tạo ReviewMedia
                ReviewMedia reviewMedia = new ReviewMedia();
                ReviewMediaId reviewMediaId = new ReviewMediaId();
                reviewMediaId.setReviewId(savedReview.getId());
                reviewMediaId.setMediaId(savedMedia.getId());
                reviewMedia.setId(reviewMediaId);
                reviewMedia.setReview(savedReview);
                reviewMedia.setMedia(savedMedia);
                reviewMedia.setSortOrder(sortOrder++);

                // Lưu ReviewMedia
                reviewMediaRepository.save(reviewMedia);
            }
        }

        // 8. Reload để lấy đầy đủ thông tin
        Review fullReview = reviewRepository.findById(savedReview.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found after creation"));

        return mapToResponse(fullReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdWithRelations(productId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserReviewed(Long userId, Long productId) {
        // Kiểm tra: số lần review >= số lần mua COMPLETED (không thể review thêm)
        long purchaseCount = orderItemRepository.countPurchasesByUserIdAndProductIdAndOrderStatusCompleted(
                userId, productId);
        long reviewCount = reviewRepository.countByUserIdAndProductId(userId, productId);
        return reviewCount >= purchaseCount;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialDto> getFiveStarTestimonials() {
        List<Review> reviews = reviewRepository.findAllFiveStarApprovedWithRelations();
        List<TestimonialDto> result = new ArrayList<>();

        int index = 0;
        for (Review r : reviews) {
            String delay = index == 0 ? "" : "0." + index + "s";
            result.add(ReviewMapper.toTestimonial(r, delay));
            index++;
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewDetail(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        // Kiểm tra quyền: user chỉ xem được review của mình hoặc review đã approved
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null) {
            // Nếu là chủ sở hữu review hoặc review đã approved thì cho xem
            if (review.getUser().getId().equals(currentUserId) || "approved".equals(review.getStatus())) {
                return mapToResponse(review);
            }
        } else {
            // User chưa đăng nhập chỉ xem được review approved
            if ("approved".equals(review.getStatus())) {
                return mapToResponse(review);
            }
        }
        
        throw new BadRequestException("You don't have permission to view this review");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null || !currentUserId.equals(userId)) {
            throw new BadRequestException("You can only view your own reviews");
        }
        
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        List<String> imageUrls = new ArrayList<>();
        if (review.getReviewMedias() != null) {
            imageUrls = review.getReviewMedias().stream()
                    .sorted((a, b) -> {
                        int orderA = a.getSortOrder() != null ? a.getSortOrder() : 0;
                        int orderB = b.getSortOrder() != null ? b.getSortOrder() : 0;
                        return Integer.compare(orderA, orderB);
                    })
                    .map(rm -> rm.getMedia() != null ? rm.getMedia().getUrl() : null)
                    .filter(url -> url != null)
                    .collect(Collectors.toList());
        }

        String userName = review.getUser() != null ?
                (review.getUser().getName() != null ? review.getUser().getName() :
                        review.getUser().getEmail() != null ? review.getUser().getEmail() : "Anonymous") :
                "Anonymous";

        String userAvatar = review.getUser() != null && review.getUser().getAvatarUrl() != null ?
                review.getUser().getAvatarUrl() : null;

        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(userName)
                .userAvatar(userAvatar)
                .rating(review.getRating())
                .content(review.getContentText())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .imageUrls(imageUrls)
                .build();
    }
}