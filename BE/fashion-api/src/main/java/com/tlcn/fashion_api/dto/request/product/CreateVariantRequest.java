package com.tlcn.fashion_api.dto.request.product;

import com.tlcn.fashion_api.dto.response.product.VariantAttributeValueDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateVariantRequest {
    private String sku;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private Integer weightGram;
    private String status; // active / inactive...

    // Thuộc tính (color, size, ...)
    private List<VariantAttributeValueDto> attributes;

    // Tồn kho ban đầu
    private Integer initialStock;          // quantity
    private Integer safetyStock;           // safety_stock
    private String stockLocation;          // location (nullable)
}