package com.tlcn.fashion_api.dto.response.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderStatusResponse {

    private Long orderId;
    private String orderCode;
    private String orderStatus;
    private String paymentStatus;

    private LocalDateTime paymentExpiresAt;
    private boolean canRePay;

    // 🔥 thêm 2 field này nếu muốn trả luôn link PayOS
    private String payosCheckoutUrl;
    private String payosQrUrl;
}

