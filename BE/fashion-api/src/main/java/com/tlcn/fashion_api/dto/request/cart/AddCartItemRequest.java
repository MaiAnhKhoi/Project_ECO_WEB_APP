package com.tlcn.fashion_api.dto.request.cart;


import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AddCartItemRequest {
    private Long productId;
    private Long variantId;   // có thể null nếu add từ ProductCard
    private Integer quantity;
    private String color;     // tên màu (VD: "Trắng", "Đen") - optional
}