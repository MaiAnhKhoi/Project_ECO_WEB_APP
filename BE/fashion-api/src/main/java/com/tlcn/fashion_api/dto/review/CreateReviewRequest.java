package com.tlcn.fashion_api.dto.review;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Byte rating;

    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    private String content;

    // Images will be handled as MultipartFile in controller
}