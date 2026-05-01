package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendationResponse {

    private List<ProductSuggestionDto> products;
    private String recommendationReason;
    private boolean fromCache;
    private Long logId;
}
