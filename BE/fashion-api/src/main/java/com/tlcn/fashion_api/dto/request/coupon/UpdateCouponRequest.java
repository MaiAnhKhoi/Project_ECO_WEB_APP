package com.tlcn.fashion_api.dto.request.coupon;

import com.tlcn.fashion_api.common.enums.CouponType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UpdateCouponRequest {

    private String code;
    private CouponType type;
    private BigDecimal value;
    private BigDecimal minOrder;
    private BigDecimal maxDiscount;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer usageLimit;
    private Integer perUserLimit;
    private String status;
}
