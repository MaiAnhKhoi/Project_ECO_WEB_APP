package com.tlcn.fashion_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.review.CreateReviewRequest;
import com.tlcn.fashion_api.dto.review.TestimonialDto;
import com.tlcn.fashion_api.dto.response.review.ReviewResponse;
import com.tlcn.fashion_api.service.review.ReviewQueryService;
import com.tlcn.fashion_api.service.review.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Product Reviews", description = "API đánh giá sản phẩm")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewQueryService reviewQueryService;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Tạo đánh giá sản phẩm",
            description = "Chỉ cho phép khách hàng đã mua sản phẩm (status: COMPLETED). " +
                    "Mỗi lần mua COMPLETED được review 1 lần. " +
                    "Ví dụ: mua 3 lần COMPLETED thì được review 3 lần")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestPart("request") String requestJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            // Parse JSON string thành CreateReviewRequest
            CreateReviewRequest request = objectMapper.readValue(requestJson, CreateReviewRequest.class);

            // Validate
            if (request.getProductId() == null) {
                throw new IllegalArgumentException("Product ID is required");
            }
            if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }

            ReviewResponse response = reviewService.createReview(request, images);
            return ResponseEntity.ok(ApiResponse.success(response, "Đánh giá đã được gửi thành công"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse review request: " + e.getMessage(), e);
        }
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Lấy danh sách đánh giá của sản phẩm")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getProductReviews(
            @PathVariable Long productId
    ) {
        List<ReviewResponse> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/product/{productId}/check")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Kiểm tra user đã đánh giá sản phẩm này chưa")
    public ResponseEntity<ApiResponse<Boolean>> checkUserReviewed(
            @PathVariable Long productId
    ) {
        Long userId = com.tlcn.fashion_api.security.SecurityUtils.getCurrentUserId();
        boolean hasReviewed = reviewService.hasUserReviewed(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(hasReviewed));
    }

    @GetMapping("/public/testimonials")
    @Operation(summary = "Lấy danh sách testimonials 5 sao")
    public ResponseEntity<ApiResponse<List<TestimonialDto>>> getTestimonials() {
        List<TestimonialDto> testimonials = reviewQueryService.getFiveStarTestimonials();
        return ResponseEntity.ok(ApiResponse.success(testimonials));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đánh giá")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewDetail(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReviewDetail(id);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @GetMapping("/my-reviews")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách đánh giá của user hiện tại")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews() {
        Long userId = com.tlcn.fashion_api.security.SecurityUtils.getCurrentUserId();
        List<ReviewResponse> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}