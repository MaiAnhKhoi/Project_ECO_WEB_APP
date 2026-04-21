// com.tlcn.fashion_api.entity.coupon.Coupon
package com.tlcn.fashion_api.entity.coupon;

import com.tlcn.fashion_api.common.enums.CouponType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponType type; // PERCENT / FIXED

    @Column(nullable = false)
    private BigDecimal value; // % hoặc số tiền cố định

    private BigDecimal minOrder;

    private BigDecimal maxDiscount;

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    private Integer usageLimit;
    private Integer perUserLimit;

    private Integer usedCount;

    private String status;   // active / inactive / expired

    private LocalDateTime createdAt;
}
