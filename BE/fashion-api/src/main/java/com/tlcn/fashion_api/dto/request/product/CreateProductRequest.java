package com.tlcn.fashion_api.dto.request.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductRequest {

    private Long brandId;                  // brands.id
    private String name;
    private String slug;
    private String description;

    // SEO
    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;

    // Tag: "trending,new-arrival"
    private String tags;

    // Thông tin thêm
    private String material;
    private String careInstructions;
    private String countryOfOrigin;

    private Boolean featured;              // is_featured
    private BigDecimal basePrice;          // products.base_price
    private String status;                 // active / draft / inactive...

    // Category IDs
    private List<Long> categoryIds;

    // (Option) tạo luôn các variant trong 1 lần
    private List<CreateVariantRequest> variants;
}