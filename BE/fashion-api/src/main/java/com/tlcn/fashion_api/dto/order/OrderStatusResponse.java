package com.tlcn.fashion_api.dto.order;

import lombok.Data;

@Data
public class OrderStatusResponse {
    private Long orderId;
    private String orderStatus;
    private String paymentStatus;
}