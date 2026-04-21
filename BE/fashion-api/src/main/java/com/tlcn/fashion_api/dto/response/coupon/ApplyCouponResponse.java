package com.tlcn.fashion_api.dto.response.coupon;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ApplyCouponResponse {
    private String code;
    private Boolean valid;
    private String message;
    private BigDecimal discountAmount;
    private BigDecimal finalTotal;
}