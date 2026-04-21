package com.tlcn.fashion_api.mapper.banner;

import com.tlcn.fashion_api.dto.response.banner.SliderItemDto;
import com.tlcn.fashion_api.entity.banner.Banner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BannerMapper {

    public SliderItemDto toSliderItem(Banner banner) {
        if (banner == null) return null;

        SliderItemDto dto = new SliderItemDto();

        // --- Set cứng layout giống FE ---
        dto.setBgType("bg-type-1");
        dto.setWidth(1920);
        dto.setHeight(939);
        dto.setColClass("col-lg-12 col-12 col-sm-6");

        // --- Mapping từ DB ---
        dto.setImageSrc(banner.getImageUrl());
        dto.setHeading(banner.getTitle()); // Cho phép chứa <br/>


        return dto;
    }

    public List<SliderItemDto> toList(List<Banner> banners) {
        if (banners == null || banners.isEmpty()) {
            return Collections.emptyList();
        }

        return banners.stream()
                .map(this::toSliderItem)
                .collect(Collectors.toList());
    }
}
