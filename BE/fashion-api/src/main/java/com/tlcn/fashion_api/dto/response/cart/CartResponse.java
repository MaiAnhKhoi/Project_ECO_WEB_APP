package com.tlcn.fashion_api.dto.response.cart;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CartResponse {

    private Long id;                     // carts.id
    private BigDecimal totalPrice;       // tổng tiền
    private List<CartItemResponse> items;
}