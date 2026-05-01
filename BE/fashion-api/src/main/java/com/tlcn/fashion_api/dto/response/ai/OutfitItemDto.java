package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OutfitItemDto {

    private Long productId;
    private String productName;
    private String slug;
    private String imageUrl;
    private BigDecimal price;
    private String category;
    private String role;
}
