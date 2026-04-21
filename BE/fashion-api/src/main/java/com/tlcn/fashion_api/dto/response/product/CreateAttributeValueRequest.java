package com.tlcn.fashion_api.dto.response.product;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class CreateAttributeValueRequest {
    @NotBlank
    private String value;
    private String code;
    private String colorCssClass;
    private String colorHex;
    private Integer sortOrder;
}