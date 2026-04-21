package com.tlcn.fashion_api.dto.response.product;

import lombok.*;

@Getter @Setter @Builder
public class AttributeValueDto {
    private Long id;
    private String value;
    private String code;
    private String colorCssClass;
    private String colorHex;
}