package com.tlcn.fashion_api.dto.response.order;

import lombok.Builder;
import lombok.Data;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Transactional
public class OrderDetailResponse {

    private Long orderId;
    private String orderCode;
    private String status;
    private String paymentStatus;

    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal taxTotal;
    private BigDecimal shippingFee;
    private BigDecimal grandTotal;

    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime paymentExpiresAt;
    private String shippingStatus;
    private String cancelReason;

    private OrderAddressResponse shippingAddress;
    private List<OrderItemResponse> items;

    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String refundBankName;
    private String refundAccountNumber;
    private String refundAccountHolder;

    private BigDecimal refundAmount;
    private String refundCode;
    private String refundReason;
    private String refundStatus;
    private LocalDateTime refundRequestedAt;

    private String paymentMethod;

    // QR hoàn tiền cho admin
    private String refundQrUrl;
}
