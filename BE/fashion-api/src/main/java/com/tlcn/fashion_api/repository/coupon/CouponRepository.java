package com.tlcn.fashion_api.repository.coupon;

import com.tlcn.fashion_api.entity.coupon.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // --- FIND BY CODE ---
    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);


    // --- GET ACTIVE COUPONS FOR USER (front) ---
    @Query("""
        SELECT c FROM Coupon c
        WHERE c.status = 'active'
          AND (c.startAt IS NULL OR c.startAt <= :now)
          AND (c.endAt IS NULL OR c.endAt >= :now)
    """)
    List<Coupon> findAllActive(@Param("now") LocalDateTime now);


    // --- SEARCH COUPON (ADMIN) ---
    @Query("""
        SELECT c FROM Coupon c
        WHERE (:keyword IS NULL OR LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:status IS NULL OR LOWER(c.status) = LOWER(:status))
    """)
    Page<Coupon> searchAdmin(@Param("keyword") String keyword,
                             @Param("status") String status,
                             Pageable pageable);
}
