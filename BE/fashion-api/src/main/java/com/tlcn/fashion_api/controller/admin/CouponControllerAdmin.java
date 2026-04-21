// com.tlcn.fashion_api.controller.admin.CouponAdminController
package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.coupon.CreateCouponRequest;
import com.tlcn.fashion_api.dto.request.coupon.UpdateCouponRequest;
import com.tlcn.fashion_api.dto.response.coupon.CouponAdminDto;
import com.tlcn.fashion_api.service.coupon.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupon Management", description = "Coupon management APIs (Admin & Marketing Staff)")
public class CouponControllerAdmin {

    private final CouponService couponService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "List coupons (Admin/Marketing)")
    public ResponseEntity<ApiResponse<PageResponse<CouponAdminDto>>> listCoupons(
            @RequestParam(required = false) String keyword,    // tìm theo code
            @RequestParam(required = false) String status,     // active, inactive, expired...
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<CouponAdminDto> pageData = couponService.listCoupons(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(pageData)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Get coupon detail (Admin/Marketing)")
    public ResponseEntity<ApiResponse<CouponAdminDto>> getCouponDetail(
            @PathVariable Long id
    ) {
        CouponAdminDto dto = couponService.getCouponDetail(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Create coupon (Admin/Marketing)")
    public ResponseEntity<ApiResponse<CouponAdminDto>> createCoupon(
            @Valid @RequestBody CreateCouponRequest request
    ) {
        CouponAdminDto dto = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Coupon created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Update coupon (Admin/Marketing)")
    public ResponseEntity<ApiResponse<CouponAdminDto>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCouponRequest request
    ) {
        CouponAdminDto dto = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Coupon updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Delete coupon (Admin/Marketing)")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(
            @PathVariable Long id
    ) {
        couponService.deleteCoupon(id); // soft delete hoặc set status = 'deleted'
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MARKETING_STAFF')")
    @Operation(summary = "Update coupon status (Admin/Marketing)")
    public ResponseEntity<ApiResponse<CouponAdminDto>> updateCouponStatus(
            @PathVariable Long id,
            @RequestParam String status  // ví dụ: active / inactive / expired
    ) {
        CouponAdminDto dto = couponService.updateCouponStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(dto, "Coupon status updated"));
    }
}
