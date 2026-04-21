package com.tlcn.fashion_api.dto.response.coupon;

import com.tlcn.fashion_api.common.enums.CouponType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponAdminDto {

    private Long id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private BigDecimal minOrder;
    private BigDecimal maxDiscount;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer usageLimit;
    private Integer perUserLimit;
    private Integer usedCount;
    private String status;

    private LocalDateTime createdAt;
}
