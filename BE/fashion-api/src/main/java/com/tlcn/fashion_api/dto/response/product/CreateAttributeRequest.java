package com.tlcn.fashion_api.dto.response.product;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class CreateAttributeRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    private Integer sortOrder;
    private String type;
}
