package com.tlcn.fashion_api.dto.request.review;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewStatusUpdateRequest {
    @NotBlank
    private String status;
}

