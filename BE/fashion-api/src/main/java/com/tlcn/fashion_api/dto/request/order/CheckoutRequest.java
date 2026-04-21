package com.tlcn.fashion_api.dto.request.order;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequest {

    private Long addressId;

    // "COD" hoặc "PAYOS"
    private String paymentMethod;

    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal taxTotal;
    private BigDecimal shippingFee;
    private BigDecimal grandTotal;

    private String couponCode; // có thể null
    private String note;

    private List<CheckoutItemDto> items;
}