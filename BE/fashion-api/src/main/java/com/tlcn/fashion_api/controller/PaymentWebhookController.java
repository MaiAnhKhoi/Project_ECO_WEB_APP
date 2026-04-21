package com.tlcn.fashion_api.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.common.enums.PaymentStatus;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.payment.Payment;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.PaymentRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/payos")
@RequiredArgsConstructor
@Slf4j
public class PaymentWebhookController {

    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CouponService couponService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handlePayOSWebhook(
            @RequestBody String body,
            @RequestHeader(value = "x-signature", required = false) String signature
    ) {

        log.info("📩 PAYOS WEBHOOK BODY = {}", body);
        log.info("📌 WEBHOOK SIGNATURE = {}", signature);

        try {

            JsonNode root = objectMapper.readTree(body);
            JsonNode dataNode = root.path("data");

            long orderCode = dataNode.path("orderCode").asLong();     // orderId chính là orderCode bạn tạo
            String status = dataNode.path("status").asText("");       // PAID / CANCELED / FAILED

            log.info("🔍 Webhook nhận: orderCode={}, status={}", orderCode, status);

            // 1. Lấy order
            Optional<Order> optOrder = orderRepository.findById(orderCode);
            if (optOrder.isEmpty()) {
                log.warn("⚠ Không tìm thấy order {}", orderCode);
                return ResponseEntity.ok("ignored");
            }

            Order order = optOrder.get();

            // 2. Lấy payment mới nhất cho PayOS
            Optional<Payment> optPayment = paymentRepository
                    .findFirstByOrderIdAndProviderOrderByCreatedAtDesc(order.getId(), PaymentProvider.PAYOS);

            if (optPayment.isEmpty()) {
                log.warn("⚠ Không tìm thấy payment PayOS cho order {}", order.getId());
                return ResponseEntity.ok("ignored");
            }

            Payment payment = optPayment.get();

            // 3. Cập nhật theo trạng thái từ PayOS
            if (status.equalsIgnoreCase("PAID")) {

                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);

                order.setPaymentStatus("paid");
                // Giữ nguyên status = "pending" để admin phải Confirm thủ công
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);

                // ⭐️ FIX: Lưu coupon usage khi thanh toán thành công qua webhook
                saveCouponUsageIfExists(order);

                log.info("✅ Đơn {}: Cập nhật PAID thành công.", order.getId());

            } else if (status.equalsIgnoreCase("CANCELED")
                    || status.equalsIgnoreCase("FAILED")) {

                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);

                order.setPaymentStatus("failed");
                order.setStatus("cancelled");
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelReason("Thanh toán PayOS thất bại/hủy");
                orderRepository.save(order);

                // ⭐️ FIX: Xóa coupon usage khi thanh toán thất bại (nếu đã lưu)
                if (order.getDiscountTotal() != null && order.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) > 0) {
                    try {
                        couponService.removeCouponUsageByOrderId(order.getId());
                    } catch (Exception e) {
                        log.error("Failed to remove coupon usage for order {}: {}", order.getId(), e.getMessage());
                    }
                }

                log.info("❌ Đơn {}: Thanh toán thất bại/hủy.", order.getId());
            }

            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            log.error("🔥 Lỗi xử lý webhook PayOS", e);
            return ResponseEntity.badRequest().body("error");
        }
    }

    /**
     * Lưu coupon usage nếu order có sử dụng coupon
     * Chỉ gọi khi thanh toán thành công
     */
    private void saveCouponUsageIfExists(Order order) {
        if (order.getDiscountTotal() == null || order.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            return; // Không có coupon
        }

        try {
            String snapshot = order.getSnapshotJson();
            if (snapshot == null || snapshot.isBlank()) {
                return;
            }

            JsonNode root = objectMapper.readTree(snapshot);
            JsonNode couponCodeNode = root.get("couponCode");
            if (couponCodeNode == null || couponCodeNode.isNull()) {
                return;
            }

            String couponCode = couponCodeNode.asText();
            if (couponCode == null || couponCode.isBlank()) {
                return;
            }

            // Tìm coupon và lưu usage
            try {
                com.tlcn.fashion_api.entity.coupon.Coupon coupon = 
                    couponService.getByCodeOrThrow(couponCode);
                
                couponService.saveCouponUsage(
                    coupon.getId(),
                    order.getId(),
                    order.getUserId(),
                    order.getDiscountTotal()
                );
            } catch (Exception e) {
                // Log error nhưng không throw để không ảnh hưởng đến flow thanh toán
                log.error("Failed to save coupon usage: {}", e.getMessage());
            }
        } catch (Exception e) {
            // Log error nhưng không throw
            log.error("Failed to parse snapshot for coupon: {}", e.getMessage());
        }
    }
}
