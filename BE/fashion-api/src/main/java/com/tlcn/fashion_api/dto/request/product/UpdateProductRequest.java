package com.tlcn.fashion_api.dto.request.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateProductRequest {

    private Long brandId;
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

    private List<Long> categoryIds;
}