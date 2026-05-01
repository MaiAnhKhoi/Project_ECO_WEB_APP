package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductSuggestionDto {

    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String reason;
    private Double matchScore;
}
