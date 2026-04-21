package com.tlcn.fashion_api.dto.response.banner;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BannerAdminDto {

    private Long id;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private String position;
    private Boolean active;
    private LocalDateTime createdAt;
}