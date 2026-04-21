package com.tlcn.fashion_api.dto.request.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyCouponRequest {
    private String code;
    private BigDecimal subtotal;
    private Long userId;
}