package com.tlcn.fashion_api.service.order;

import com.tlcn.fashion_api.common.enums.OrderStatus;
import com.tlcn.fashion_api.dto.request.sepay.SepayTransactionDto;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.Refund;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.RefundRepository;
import com.tlcn.fashion_api.sepay.SepayClient;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefundChecker {

    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final SepayClient sepay;
    private final InventoryService inventoryService;
    private final CouponService couponService;

    @Scheduled(fixedDelay = 100_000, initialDelay = 5_000)
    public void checkRefunds() {

        log.info("🔄 [RefundChecker] Bắt đầu kiểm tra refund REQUESTED / PROCESSING...");

        // check cả yêu cầu (REQUESTED) và đang xử lý (PROCESSING)
        List<Refund> list = refundRepository.findByStatusIn(List.of("REQUESTED", "PROCESSING"));

        if (list.isEmpty()) {
            log.info("⚪ Không có refund REQUESTED / PROCESSING nào.");
            return;
        }

        for (Refund refund : list) {
            try {
                log.info("🟦 Kiểm tra refundCode={} status={} amount={} createdAt={}",
                        refund.getRefundCode(), refund.getStatus(), refund.getAmount(), refund.getCreatedAt());

                LocalDateTime fromTime = refund.getCreatedAt().minusDays(1);

                // ⭐ LUÔN normalize code
                String normalizedCode = normalizeRefundCode(refund.getRefundCode());
                log.info("🔧 Normalize refundCode: original='{}' → normalized='{}'",
                        refund.getRefundCode(), normalizedCode);

                log.info("➡ Gọi SePay tìm giao dịch tiền ra từ thời điểm: {}", fromTime);

                Optional<SepayTransactionDto> tx =
                        sepay.findOutgoingTransactionForRefund(
                                refund.getAmount(),
                                normalizedCode,
                                fromTime
                        );

                if (tx.isEmpty()) {
                    log.warn("❗ Không tìm thấy giao dịch cho refundCode={} (normalized={}) | amount={} | from={}",
                            refund.getRefundCode(), normalizedCode, refund.getAmount(), fromTime);
                    continue;
                }

                SepayTransactionDto t = tx.get();

                log.info("🟢 Tìm thấy giao dịch trùng khớp trong SePay:");
                log.info("   → transactionId={}", t.getId());
                log.info("   → amount_out={}", t.getAmount_out());
                log.info("   → content='{}'", t.getTransaction_content());
                log.info("   → time={}", t.getTransaction_date());

                String oldRefundStatus = refund.getStatus();

                // ✅ Cập nhật refund → DONE
                refund.setStatus("DONE");
                refund.setSepayTransactionId(t.getId());

                try {
                    refund.setTransactionDate(LocalDateTime.parse(
                            t.getTransaction_date().replace(" ", "T")
                    ));
                } catch (Exception e) {
                    log.warn("⚠ Không parse được transaction_date='{}'", t.getTransaction_date());
                }

                refund.setUpdatedAt(LocalDateTime.now());
                refundRepository.save(refund);

                log.info("✔ Refund {} → DONE cho refundCode={}", oldRefundStatus, refund.getRefundCode());

                // ✅ Cập nhật order
                Order order = orderRepository.findById(refund.getOrderId()).orElse(null);

                if (order == null) {
                    log.warn("⚠ Không tìm thấy Order cho refundCode={}", refund.getRefundCode());
                    continue;
                }

                // Check trạng thái hiện tại của order
                String currentStatus = order.getStatus();

                if (!OrderStatus.CANCEL_REQUESTED.name().equalsIgnoreCase(currentStatus)
                        && !OrderStatus.CANCELLED.name().equalsIgnoreCase(currentStatus)) {
                    log.warn("⚠ Order={} đang ở status={} nhưng refund DONE. Không tự động restock.",
                            order.getOrderCode(), currentStatus);
                    // Vẫn có thể cập nhật paymentStatus để không bị lệch, tùy bạn:
                    order.setPaymentStatus("refunded");
                    orderRepository.save(order);
                    continue;
                }

                // ✅ Nếu đơn đang chờ hủy / đã hủy → set CANCELLED + paymentStatus refunded
                order.setPaymentStatus("refunded");
                order.setStatus(OrderStatus.CANCELLED.name());

                // nếu chưa có cancelledAt thì set luôn
                if (order.getCancelledAt() == null) {
                    order.setCancelledAt(LocalDateTime.now());
                }

                orderRepository.save(order);

                // ✅ hoàn hàng về kho
                inventoryService.restockForOrder(order);

                // ⭐️ FIX: Xóa coupon usage khi refund hoàn tất (rollback limit)
                if (order.getDiscountTotal() != null && order.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) > 0) {
                    try {
                        couponService.removeCouponUsageByOrderId(order.getId());
                        log.info("✔ Đã xóa coupon usage cho order={}", order.getOrderCode());
                    } catch (Exception e) {
                        log.error("❌ Failed to remove coupon usage for order {}: {}", order.getId(), e.getMessage());
                    }
                }

                log.info("✔ Hoàn tất refund & hủy đơn: refundCode={} | Order={} | status=CANCELLED, paymentStatus=refunded",
                        refund.getRefundCode(), order.getOrderCode());

            } catch (Exception e) {
                log.error("❌ Lỗi khi check refundCode={}: {}", refund.getRefundCode(), e.getMessage());
                e.printStackTrace();
            }
        }
    }

    // ⭐ CHỈ GIỮ LẠI A–Z + 0–9
    private String normalizeRefundCode(String code) {
        if (code == null) return "";
        return code.replaceAll("[^A-Za-z0-9]", "").trim();
    }
}