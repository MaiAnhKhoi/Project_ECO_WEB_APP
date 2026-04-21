package com.tlcn.fashion_api.dto.response.product;

import lombok.*;
import java.util.List;


@Getter @Setter @Builder
public class AttributeDto {
    private Long id;
    private String name;
    private String code;
    private Integer sortOrder;
    private String type;
    private List<AttributeValueDto> values;
}