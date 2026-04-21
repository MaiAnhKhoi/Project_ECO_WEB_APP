package com.tlcn.fashion_api.dto.response.cart;

import lombok.Data;

import java.math.BigDecimal;

import lombok.Data;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CartItemResponse {

    private Long id;              // cart_items.id
    private Long productId;       // products.id
    private String productName;
    private String productSlug;

    private Long variantId;       // product_variants.id
    private String color;         // từ attributes.name = 'Color'
    private String size;          // từ attributes.name = 'Size'

    private BigDecimal price;     // đơn giá của variant
    private Integer quantity;     // cart_items.qty
    private Integer maxQuantity;  // stocks.quantity

    private String imgSrc;        // ảnh sản phẩm chính hoặc ảnh biến thể

    private List<VariantOptionResponse> variantOptions;
    private Boolean adjusted;     // true nếu BE đã auto chỉnh qty
    private String message;
}