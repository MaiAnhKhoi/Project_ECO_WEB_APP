package com.tlcn.fashion_api.dto.response.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
