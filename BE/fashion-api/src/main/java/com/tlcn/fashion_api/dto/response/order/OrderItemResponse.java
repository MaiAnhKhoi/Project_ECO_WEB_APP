package com.tlcn.fashion_api.dto.response.order;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {

    private Long id;          // id dòng order_item
    private Long productId;
    private Long variantId;

    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal lineTotal;

    private String productName;
    private String color;
    private String size;
    private String imageUrl;
}