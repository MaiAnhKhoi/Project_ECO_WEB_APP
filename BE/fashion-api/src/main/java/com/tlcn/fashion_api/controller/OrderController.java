package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.response.order.OrderStatusResponse;
import com.tlcn.fashion_api.dto.request.order.CancelOrderRequest;
import com.tlcn.fashion_api.dto.response.order.CheckoutResponse;
import com.tlcn.fashion_api.dto.response.order.OrderDetailResponse;
import com.tlcn.fashion_api.dto.response.order.OrderPageResponse;
import com.tlcn.fashion_api.dto.response.order.OrderSummaryResponse;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.order.OrderPaymentService;
import com.tlcn.fashion_api.service.order.OrderQueryService;
import com.tlcn.fashion_api.service.order.OrderService;
import com.tlcn.fashion_api.service.order.OrderUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderPaymentService orderPaymentService;
    private final OrderRepository orderRepository;
    private final OrderQueryService orderQueryService;
    private final OrderUserService orderUserService;

    @PostMapping("/{orderId}/payos/pay")
    public CheckoutResponse rePay(@PathVariable Long orderId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return orderPaymentService.rePayWithPayOS(orderId, userId);
    }

    @GetMapping("/{orderId}/payos/status")
    public OrderStatusResponse checkPayOSStatus(@PathVariable Long orderId) {

        Long userId = SecurityUtils.getCurrentUserId();

        // cập nhật trạng thái từ PayOS về DB (paid / failed / cancelled...)
        orderPaymentService.checkPayOSStatus(orderId, userId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        OrderStatusResponse resp = new OrderStatusResponse();
        resp.setOrderId(order.getId());
        resp.setOrderStatus(order.getStatus());
        resp.setPaymentStatus(order.getPaymentStatus());
        resp.setPaymentExpiresAt(order.getPaymentExpiresAt());

        // ✅ CHỈ CHO PHÉP RE-PAY KHI:
        // - Đơn vẫn pending
        // - paymentStatus vẫn unpaid
        // - Chưa quá hạn payment_expires_at
        boolean canRePay = "pending".equalsIgnoreCase(order.getStatus())
                && "unpaid".equalsIgnoreCase(order.getPaymentStatus())
                && order.getPaymentExpiresAt() != null
                && order.getPaymentExpiresAt().isAfter(LocalDateTime.now());

        resp.setCanRePay(canRePay);

        return resp;
    }


    // ⭐⭐ CẬP NHẬT CHUẨN ⭐⭐
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelMyOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) CancelOrderRequest req
    ) {
        Long userId = SecurityUtils.getCurrentUserId();

        if (req == null) {
            req = new CancelOrderRequest(); // tránh NullPointer
        }

        orderUserService.cancelMyOrder(orderId, userId, req);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public OrderPageResponse getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = SecurityUtils.getCurrentUserId();
        return orderQueryService.getMyOrders(userId, page, size);
    }

    @GetMapping("/{orderId}")
    public OrderDetailResponse getMyOrderDetail(@PathVariable Long orderId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return orderQueryService.getMyOrderDetail(orderId, userId);
    }
}
