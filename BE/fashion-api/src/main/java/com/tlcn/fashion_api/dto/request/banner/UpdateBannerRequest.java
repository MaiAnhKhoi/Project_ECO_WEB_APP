package com.tlcn.fashion_api.dto.request.banner;

import lombok.Data;

@Data
public class UpdateBannerRequest {

    private String title;

    private String imageUrl;

    private String linkUrl;

    private String position;

    private Boolean active;
}
