package com.tlcn.fashion_api.dto.request.cart;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateCartItemRequest {
    private Integer quantity;   // optional
    private Long variantId;     // optional - đổi color/size
}