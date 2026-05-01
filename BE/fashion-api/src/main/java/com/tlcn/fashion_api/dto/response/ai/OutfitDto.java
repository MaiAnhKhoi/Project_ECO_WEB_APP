package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OutfitDto {

    private Integer outfitNumber;
    private String name;
    private String description;
    private String occasion;
    private String style;
    private List<OutfitItemDto> items;
    private BigDecimal totalPrice;
}
