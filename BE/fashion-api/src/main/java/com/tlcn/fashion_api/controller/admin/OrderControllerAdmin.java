package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.order.AdminUpdateOrderStatusRequest;
import com.tlcn.fashion_api.dto.request.order.AdminUpdateShippingStatusRequest;
import com.tlcn.fashion_api.dto.response.order.OrderDetailResponse;
import com.tlcn.fashion_api.dto.response.order.OrderPageResponse;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.order.OrderService;
import com.tlcn.fashion_api.service.order.OrderUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management (Admin)", description = "Order management APIs for Admin & Order Manager")
public class OrderControllerAdmin {

    private final OrderService orderService;
    private final OrderUserService orderUserService;

    // =======================
    // 1️⃣ LIST TẤT CẢ ĐƠN
    // =======================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "List all orders")
    public ResponseEntity<ApiResponse<OrderPageResponse>> listAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        OrderPageResponse pageData = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success(pageData));
    }

    // =======================
    // 2️⃣ XEM CHI TIẾT ĐƠN
    // =======================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "Get order detail (Admin/Order Manager)")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> getOrderDetail(
            @PathVariable Long id
    ) {
        OrderDetailResponse dto = orderService.getOrderDetail(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // =======================
    // 3️⃣ ADMIN CẬP NHẬT ORDER STATUS
    // =======================
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "Update order status (Admin/Order Manager)")
    public ResponseEntity<ApiResponse<Void>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody AdminUpdateOrderStatusRequest request
    ) {
        orderService.updateOrderStatus(id, request.getStatus(), request.getNote());
        return ResponseEntity.ok(ApiResponse.success(null, "Order status updated"));
    }

    // =======================
    // 4️⃣ ADMIN CẬP NHẬT SHIPPING STATUS
    // =======================
    @PutMapping("/{id}/shipping-status")
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "Update shipping status (Admin/Order Manager)")
    public ResponseEntity<ApiResponse<Void>> updateShippingStatus(
            @PathVariable Long id,
            @RequestBody AdminUpdateShippingStatusRequest request
    ) {
        orderService.updateShippingStatus(id, request.getShippingStatus());
        return ResponseEntity.ok(ApiResponse.success(null, "Shipping status updated"));
    }

    // =======================
    // 5️⃣ ADMIN HỦY ĐƠN
    // =======================
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "Admin cancel order (unpaid or paid)")
    public ResponseEntity<ApiResponse<Void>> adminCancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        Long adminUserId = SecurityUtils.getCurrentUserId(); // 🎯 LẤY TỪ TOKEN
        orderService.adminCancelOrder(id, adminUserId, reason);
        return ResponseEntity.ok(ApiResponse.success(null, "Order cancelled by admin"));
    }

    // =======================
    // 6️⃣ ADMIN XÁC NHẬN REFUND
    // =======================
    @PostMapping("/refund/{refundId}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN','ORDER_MANAGER')")
    @Operation(summary = "Admin confirm refund (starts refunding process)")
    public ResponseEntity<ApiResponse<Void>> adminConfirmRefund(
            @PathVariable Long refundId
    ) {
        Long adminUserId = SecurityUtils.getCurrentUserId(); // 🎯 LẤY TỪ TOKEN
        orderUserService.adminConfirmRefund(refundId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null, "Refund confirmed & processing"));
    }

}
