package com.tlcn.fashion_api.dto.response.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Builder
public class OrderSummaryResponse {

    private Long orderId;
    private String orderCode;
    private String status;
    private String paymentStatus;
    private BigDecimal grandTotal;
    private LocalDateTime createdAt;

    private String paymentMethod;
    private String cancelReason; // Lý do hủy đơn (nếu admin đã hủy)
}