package com.tlcn.fashion_api.dto.request.category;

import lombok.Data;

@Data
public class UpdateCategoryRequest {

    private Long parentId;

    private String name;

    private String slug;

    private String description;

    private Integer sortOrder;

    private String imageUrl;
}