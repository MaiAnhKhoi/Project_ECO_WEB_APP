package com.tlcn.fashion_api.dto.request.coupon;

import com.tlcn.fashion_api.common.enums.CouponType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateCouponRequest {

    @NotBlank
    private String code;

    @NotNull
    private CouponType type;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal value;

    private BigDecimal minOrder;
    private BigDecimal maxDiscount;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    private Integer usageLimit;

    private Integer perUserLimit;

    @NotBlank
    private String status;
}
