package com.tlcn.fashion_api.dto.response.categorie;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CategoryDto {
    private Long id;
    private Long parentId;
    private String name;
    private String slug;
    private String imageUrl;
    private Integer sortOrder;
    private String description;
    private LocalDateTime createdAt;
}
