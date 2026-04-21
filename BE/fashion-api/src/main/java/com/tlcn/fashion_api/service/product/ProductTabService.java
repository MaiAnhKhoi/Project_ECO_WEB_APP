package com.tlcn.fashion_api.service.product;

import com.tlcn.fashion_api.dto.response.product.*;
import com.tlcn.fashion_api.entity.product.Brand;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.review.Review;
import com.tlcn.fashion_api.repository.brand.BrandRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.VariantAttributeProjection;
import com.tlcn.fashion_api.repository.product.VariantAttributeRepository;
import com.tlcn.fashion_api.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductTabService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final VariantAttributeRepository variantAttributeRepository;
    private final BrandRepository brandRepository;

    private static final DateTimeFormatter REVIEW_DATE_FORMATTER =
            DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH);

    public ProductDescriptionResponse getDescription(Long productId) {
        Product product = getProduct(productId);

        List<String> paragraphs = List.of(
                Optional.ofNullable(product.getDescription())
                        .orElse("Mô tả sản phẩm đang được cập nhật.")
        );

        // Không còn bullets cứng
        List<String> bullets = new ArrayList<>();

        return ProductDescriptionResponse.builder()
                .productId(product.getId())
                .title(product.getName())
                .paragraphs(paragraphs)
                .bulletPoints(bullets)
                .build();
    }

    public ProductMaterialsResponse getMaterials(Long productId) {
        Product product = getProduct(productId);

        List<String> items = new ArrayList<>();
        if (product.getMaterial() != null) {
            items.add("Content: " + product.getMaterial());
        }
        if (product.getCareInstructions() != null) {
            items.add("Care: " + product.getCareInstructions());
        }
        if (product.getCountryOfOrigin() != null) {
            items.add("Country of origin: " + product.getCountryOfOrigin());
        }

        return ProductMaterialsResponse.builder()
                .productId(product.getId())
                .title("Materials Care")
                .items(items)
                .build();
    }

    public ProductAdditionalInfoResponse getAdditionalInfo(Long productId) {
        Product product = getProduct(productId);

        List<AdditionalInfoItem> items = new ArrayList<>();

        if (product.getMaterial() != null) {
            items.add(new AdditionalInfoItem("Material", product.getMaterial()));
        }

        if (product.getBrandId() != null) {
            brandRepository.findById(product.getBrandId())
                    .ifPresent(brand -> items.add(new AdditionalInfoItem("Brand", brand.getName())));
        }

        List<VariantAttributeProjection> attrs =
                variantAttributeRepository.findColorAndSizeByProductId(productId);
        for (VariantAttributeProjection attr : attrs) {
            items.add(new AdditionalInfoItem(attr.getAttributeName(), attr.getAttributeValues()));
        }

        return ProductAdditionalInfoResponse.builder()
                .productId(product.getId())
                .items(items)
                .build();
    }

    public ProductReviewsResponse getReviews(Long productId) {
        List<Review> reviews = reviewRepository
                .findByProductIdAndStatusOrderByCreatedAtDesc(productId, "approved");

        List<ReviewItemDto> reviewDtos = reviews.stream()
                .map(r -> ReviewItemDto.builder()
                        .id(r.getId())
                        .name(r.getUser() != null ? r.getUser().getName() : "Anonymous")
                        .date(r.getCreatedAt() != null
                                ? r.getCreatedAt().format(REVIEW_DATE_FORMATTER)
                                : "")
                        .avatar(r.getUser() != null ? r.getUser().getAvatarUrl() : "/images/avatar/default.jpg")
                        .rating(r.getRating())
                        .comment(r.getContentText())
                        .build())
                .collect(Collectors.toList());

        long total = reviews.size();
        double avg = total == 0
                ? 0.0
                : reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        Map<Integer, Long> counter = reviews.stream()
                .collect(Collectors.groupingBy(r -> (int) r.getRating(), Collectors.counting()));

        List<RatingBreakdownDto> breakdown = IntStream.rangeClosed(1, 5)
                .map(i -> 6 - i) // 5..1
                .mapToObj(star -> RatingBreakdownDto.builder()
                        .rating(star)
                        .count(counter.getOrDefault(star, 0L))
                        .build())
                .collect(Collectors.toList());

        ReviewSummaryDto summary = ReviewSummaryDto.builder()
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .totalReviews(total)
                .breakdown(breakdown)
                .build();

        return ProductReviewsResponse.builder()
                .productId(productId)
                .summary(summary)
                .reviews(reviewDtos)
                .build();
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
    }
}
