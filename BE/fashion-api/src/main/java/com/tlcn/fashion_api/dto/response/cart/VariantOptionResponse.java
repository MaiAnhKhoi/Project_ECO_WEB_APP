package com.tlcn.fashion_api.dto.response.cart;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class VariantOptionResponse {

    private Long variantId;
    private String color;
    private String size;
    private BigDecimal price;
    private Integer maxQuantity;
    private String imageUrl;
}
