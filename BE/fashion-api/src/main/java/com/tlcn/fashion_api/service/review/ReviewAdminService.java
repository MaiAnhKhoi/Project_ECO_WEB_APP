package com.tlcn.fashion_api.service.review;

import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.review.ReviewStatusUpdateRequest;
import com.tlcn.fashion_api.dto.response.review.ReviewAdminDto;
import com.tlcn.fashion_api.entity.review.Review;
import com.tlcn.fashion_api.repository.review.ReviewRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewAdminService {

    private static final Set<String> ALLOWED_STATUS = Set.of("pending", "approved", "rejected");

    private final ReviewRepository reviewRepository;

    public PageResponse<ReviewAdminDto> listReviews(
            Integer page,
            Integer size,
            Long productId,
            Byte rating,
            String status,
            String keyword
    ) {
        Pageable pageable = PageRequest.of(
                page == null || page < 0 ? 0 : page,
                size == null || size <= 0 ? 20 : size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<Review> spec = buildSpecification(productId, rating, status, keyword);

        Page<Review> result = reviewRepository.findAll(spec, pageable);

        Page<ReviewAdminDto> mapped = result.map(this::toDto);
        return PageResponse.of(mapped);
    }

    @Transactional(readOnly = true)
    public ReviewAdminDto getDetail(Long id) {
        Review review = reviewRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        return toDto(review);
    }

    @Transactional
    public ReviewAdminDto updateStatus(Long id, ReviewStatusUpdateRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        String normalized = normalizeStatus(request.getStatus());
        review.setStatus(normalized);

        return toDto(reviewRepository.save(review));
    }

    private Specification<Review> buildSpecification(
            Long productId,
            Byte rating,
            String status,
            String keyword
    ) {
        return (root, query, cb) -> {
            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            if (productId != null) {
                predicates.add(cb.equal(root.get("product").get("id"), productId));
            }
            if (rating != null) {
                predicates.add(cb.equal(root.get("rating"), rating));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), normalizeStatus(status)));
            }
            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase(Locale.ROOT).trim() + "%";
                Join<?, ?> productJoin = root.join("product", JoinType.LEFT);
                Join<?, ?> userJoin = root.join("user", JoinType.LEFT);
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(productJoin.get("name")), like),
                                cb.like(cb.lower(userJoin.get("name")), like), // Sửa fullName thành name
                                cb.like(cb.lower(root.get("contentText")), like)
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return "pending";
        }
        String normalized = status.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_STATUS.contains(normalized)) {
            throw new IllegalArgumentException("Invalid review status: " + status);
        }
        return normalized;
    }

    private ReviewAdminDto toDto(Review review) {
        List<String> imageUrls = review.getReviewMedias() == null
                ? List.of()
                : review.getReviewMedias().stream()
                .map(media -> media.getMedia() != null ? media.getMedia().getUrl() : null)
                .filter(url -> url != null && !url.isBlank())
                .collect(Collectors.toList());

        return ReviewAdminDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .status(review.getStatus())
                .content(review.getContentText())
                .createdAt(review.getCreatedAt())
                .imageUrls(imageUrls)
                .build();
    }
}

