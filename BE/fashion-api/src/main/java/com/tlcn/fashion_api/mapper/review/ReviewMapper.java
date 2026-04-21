package com.tlcn.fashion_api.mapper.review;

import com.tlcn.fashion_api.dto.review.TestimonialDto;
import com.tlcn.fashion_api.entity.review.Review;
import com.tlcn.fashion_api.entity.review.ReviewMedia;

public class ReviewMapper {

    public static TestimonialDto toTestimonial(Review review, String delay) {
        if (review == null) return null;

        String name = review.getUser() != null ? review.getUser().getName() : "Ẩn danh";
        String reviewText = review.getContentText();
        String productName = review.getProduct() != null ? review.getProduct().getName() : null;

        // Lấy media đầu tiên
        String imageUrl = null;

        if (review.getReviewMedias() != null && !review.getReviewMedias().isEmpty()) {
            ReviewMedia rm = review.getReviewMedias().get(0);
            if (rm.getMedia() != null) {
                imageUrl = rm.getMedia().getUrl();
            }
        }

        // fallback avatar user nếu cần
        if (imageUrl == null && review.getUser() != null) {
            imageUrl = review.getUser().getAvatarUrl();
        }

        return new TestimonialDto(
                name,
                reviewText,
                productName,
                imageUrl,
                delay
        );
    }
}
