package com.tlcn.fashion_api.repository.coupon;


import com.tlcn.fashion_api.entity.coupon.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    long countByCouponId(Long couponId);

    long countByCouponIdAndUserId(Long couponId, Long userId);

    Optional<CouponUsage> findByOrderId(Long orderId);

    @Modifying
    @Query("DELETE FROM CouponUsage cu WHERE cu.orderId = :orderId")
    void deleteByOrderId(@Param("orderId") Long orderId);
}

