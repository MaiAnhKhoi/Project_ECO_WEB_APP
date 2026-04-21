package com.tlcn.fashion_api.dto.request.brand;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateBrandRequest {

    @NotBlank(message = "Brand name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String imageUrl;
}