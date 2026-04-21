package com.tlcn.fashion_api.dto.response.product;

import lombok.Data;

@Data
public class VariantAttributeValueDto {
    private Long attributeId;       // attributes.id
    private Long attributeValueId;  // attribute_values.id
}