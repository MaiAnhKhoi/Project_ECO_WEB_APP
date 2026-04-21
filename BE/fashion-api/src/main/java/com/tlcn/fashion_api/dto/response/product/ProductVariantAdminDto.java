package com.tlcn.fashion_api.dto.response.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductVariantAdminDto {
    private Long id;
    private String sku;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private Integer weightGram;
    private String status;
    private Boolean isDefault;

    // Tồn kho
    private Integer stockQuantity;
    private Integer safetyStock;
    private String stockLocation;

    // Thuộc tính
    private List<VariantAttributePairDto> attributes;

    // Ảnh variant
    private List<ImageDto> images;
}