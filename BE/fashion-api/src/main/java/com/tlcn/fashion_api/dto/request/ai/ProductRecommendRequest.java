package com.tlcn.fashion_api.dto.request.ai;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProductRecommendRequest {

    @Size(max = 500)
    private String prompt;

    private List<Long> viewedProductIds;

    private String sessionId;

    private Integer limit = 10;
}
