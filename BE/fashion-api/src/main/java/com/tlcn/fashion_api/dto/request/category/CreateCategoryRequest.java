package com.tlcn.fashion_api.dto.request.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {

    private Long parentId;

    @NotBlank
    private String name;

    // có thể để optional, nếu null thì tự generate từ name trong service
    private String slug;

    private String description;

    private Integer sortOrder = 1;

    private String imageUrl;
}