package com.tlcn.fashion_api.dto.request.product;

import com.tlcn.fashion_api.dto.response.product.VariantAttributeValueDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateVariantRequest {
    private String sku;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private Integer weightGram;
    private String status;
    private Boolean isDefault; // flag variant mặc định

    private List<VariantAttributeValueDto> attributes;
}