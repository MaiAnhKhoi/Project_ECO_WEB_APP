package com.tlcn.fashion_api.service.review;

import com.tlcn.fashion_api.dto.review.CreateReviewRequest;
import com.tlcn.fashion_api.dto.review.TestimonialDto;
import com.tlcn.fashion_api.dto.response.review.ReviewResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(CreateReviewRequest request, List<MultipartFile> images);
    List<ReviewResponse> getProductReviews(Long productId);
    boolean hasUserReviewed(Long userId, Long productId);
    List<TestimonialDto> getFiveStarTestimonials();
    ReviewResponse getReviewDetail(Long reviewId);
    List<ReviewResponse> getUserReviews(Long userId);
}