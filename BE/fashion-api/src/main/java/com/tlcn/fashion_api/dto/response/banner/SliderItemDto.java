package com.tlcn.fashion_api.dto.response.banner;

import lombok.Data;

@Data
public class SliderItemDto {
    private String bgType;
    private String imageSrc;
    private int width;
    private int height;
    private String heading;
    private String subText;
    private String colClass;
}
