package com.tlcn.fashion_api.dto.response.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VariantAttributePairDto {
    private Long attributeId;
    private String attributeName;
    private Long attributeValueId;
    private String attributeValue;
}