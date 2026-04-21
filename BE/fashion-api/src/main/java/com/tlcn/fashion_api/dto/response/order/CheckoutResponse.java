package com.tlcn.fashion_api.dto.response.order;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CheckoutResponse {
    private Long orderId;
    private String orderCode;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;

    // PAYOS
    private String payosCheckoutUrl;
    private String payosQrUrl;
    private LocalDateTime paymentExpiresAt;
}