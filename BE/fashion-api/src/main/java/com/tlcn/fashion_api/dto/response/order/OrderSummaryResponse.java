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
    /** Hết hạn thanh toán PayOS (null nếu không áp dụng) — để FE chỉ hiện Thanh toán lại khi còn hạn */
    private LocalDateTime paymentExpiresAt;

    private String paymentMethod;
    private String cancelReason; // Lý do hủy đơn (nếu admin đã hủy)
}