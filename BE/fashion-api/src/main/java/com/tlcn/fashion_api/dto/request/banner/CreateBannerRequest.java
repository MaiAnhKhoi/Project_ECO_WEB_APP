package com.tlcn.fashion_api.dto.request.banner;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBannerRequest {

    @NotBlank
    private String title;

    private String imageUrl;

    private String linkUrl;

    private String position;

    private Boolean active = true;
}