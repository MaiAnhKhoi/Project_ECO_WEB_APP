package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.coupon.ApplyCouponRequest;
import com.tlcn.fashion_api.dto.response.coupon.ApplyCouponResponse;
import com.tlcn.fashion_api.entity.coupon.Coupon;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /**
     * Lấy tất cả mã giảm giá hợp lệ, còn thời hạn, còn lượt dùng cho user từ token
     *
     * GET /api/coupons/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<Coupon> coupons = couponService.getActiveCouponsForUser(userId);
        return ResponseEntity.ok(coupons);
    }

    /**
     * Áp dụng mã giảm giá cho đơn hiện tại (subtotal)
     *
     * POST /api/coupons/apply
     * body: {
     *   "code": "WELCOME10",
     *   "subtotal": 500000
     * }
     */
    @PostMapping("/apply")
    public ResponseEntity<ApplyCouponResponse> applyCoupon(
            @RequestBody ApplyCouponRequest request
    ) {
        // Gán userId từ token vào request
        Long userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);

        ApplyCouponResponse response = couponService.applyCoupon(request);
        return ResponseEntity.ok(response);
    }
}
