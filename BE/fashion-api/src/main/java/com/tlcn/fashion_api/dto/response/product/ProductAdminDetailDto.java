package com.tlcn.fashion_api.dto.response.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductAdminDetailDto {
    private Long id;
    private Long brandId;
    private String brandName;

    private String name;
    private String slug;
    private String description;

    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;
    private String tags;

    private String material;
    private String careInstructions;
    private String countryOfOrigin;

    private Boolean featured;
    private BigDecimal basePrice;
    private String status;

    private Integer viewCount;
    private Integer soldCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Categories
    private List<Long> categoryIds;
    private List<String> categoryNames;

    // Ảnh product
    private List<ImageDto> images;

    // Variants
    private List<ProductVariantAdminDto> variants;
}