package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.response.banner.SliderItemDto;
import com.tlcn.fashion_api.service.banner.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/home")
    public List<SliderItemDto> getHomeBanners() {
        return bannerService.getHomeSliders();
    }
}