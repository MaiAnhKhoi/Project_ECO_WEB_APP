package com.tlcn.fashion_api.dto.response.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageDto {
    private Long id;
    private String url;
    private String alt;
    private Integer sortOrder;
    private Boolean primary;
    private Boolean hover;
}