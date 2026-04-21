package com.tlcn.fashion_api.dto.request.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogCategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không được quá 100 ký tự")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    @Size(max = 100, message = "Slug không được quá 100 ký tự")
    private String slug;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    private String description;

    private String imageUrl;

    private Integer sortOrder;

    private Boolean isActive;
}