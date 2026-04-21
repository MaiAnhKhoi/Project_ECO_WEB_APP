package com.tlcn.fashion_api.service.order;

import com.tlcn.fashion_api.common.enums.OrderStatus;
import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.common.enums.PaymentStatus;
import com.tlcn.fashion_api.dto.request.order.CancelOrderRequest;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.Refund;
import com.tlcn.fashion_api.entity.payment.Payment;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.PaymentRepository;
import com.tlcn.fashion_api.repository.order.RefundRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderUserService {

    private final OrderRepository orderRepository;
    private final RefundRepository refundRepository;
    private final InventoryService inventoryService;
    private final PaymentRepository paymentRepository;
    private final CouponService couponService;

    /**
     * 👤 User tự hủy / gửi yêu cầu hoàn tiền:
     * - Chỉ cho hủy khi đơn CHƯA GIAO: shippingStatus = "unfulfilled"
     * - Nếu chưa thanh toán -> hủy + release tồn kho (status = CANCELLED)
     * - Nếu đã thanh toán PayOS:
     *      + paymentStatus = "paid"  (user tự hủy)
     *      + hoặc "refund_info_required" (admin đã hủy, yêu cầu user cung cấp info)
     *   -> tạo Refund + chuyển status = CANCEL_REQUESTED
     *   -> CANCELLED chỉ dùng khi refund DONE (ở RefundChecker)
     */
    @Transactional
    public void cancelMyOrder(Long orderId, Long currentUserId, CancelOrderRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        // user khác -> không cho hủy
        if (!Objects.equals(order.getUserId(), currentUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Bạn không sở hữu đơn hàng này");
        }

        LocalDateTime now = LocalDateTime.now();

        String status = order.getStatus() == null ? "" : order.getStatus();
        String paymentStatus = order.getPaymentStatus() == null
                ? "unpaid"
                : order.getPaymentStatus().toLowerCase();

        boolean isCancelled = OrderStatus.CANCELLED.name().equalsIgnoreCase(status);
        boolean isCancelRequested = OrderStatus.CANCEL_REQUESTED.name().equalsIgnoreCase(status);
        boolean isCompleted = OrderStatus.COMPLETED.name().equalsIgnoreCase(status);

        // ❌ Đơn đã hoàn tất -> không cho can thiệp
        if (isCompleted) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã hoàn tất, không thể hủy/hoàn tiền");
        }

        // ❌ Đơn đang trong flow CANCEL_REQUESTED nhưng không phải kiểu admin yêu cầu info nữa
        // (vd: đã refund_requested / refund_processing) -> không cho gửi thêm
        if (isCancelRequested
                && !"refund_info_required".equalsIgnoreCase(order.getPaymentStatus())
                && !"paid".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đang trong quá trình hủy/hoàn tiền, không thể yêu cầu thêm");
        }

        // ❌ Đơn đã CANCELLED mà không phải case "admin để refund_info_required" -> coi như kết thúc
        if (isCancelled
                && !"refund_info_required".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã hủy, không thể hủy/hoàn tiền thêm");
        }

        // chỉ cho hủy / yêu cầu refund khi chưa giao
        if (!"unfulfilled".equalsIgnoreCase(order.getShippingStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã được xử lý giao, không thể hủy");
        }

        // ========== CASE 1: chưa thanh toán ==========
        if (paymentStatus.equals("unpaid")
                || paymentStatus.equals("failed")
                || paymentStatus.equals("expired")) {

            // ❗ Chưa thanh toán → hủy xong là xong → CANCELLED + trả kho
            order.setStatus(OrderStatus.CANCELLED.name());
            order.setCancelledAt(now);
            order.setCancelReason(
                    request.getReason() != null ? request.getReason()
                            : "Người dùng hủy đơn trước khi thanh toán"
            );

            orderRepository.save(order);

            // giải phóng reservation, trả kho
            inventoryService.releaseForOrder(order, false);

            // ⭐️ FIX: Xóa coupon usage khi order bị hủy (rollback limit)
            if (order.getDiscountTotal() != null && order.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) > 0) {
                try {
                    couponService.removeCouponUsageByOrderId(order.getId());
                } catch (Exception e) {
                    // Log error nhưng không throw để không ảnh hưởng đến flow hủy đơn
                    System.err.println("Failed to remove coupon usage for order " + order.getId() + ": " + e.getMessage());
                }
            }

            return;
        }

        // ========== CASE 2: đã thanh toán ==========
        // chấp nhận cả:
        //  - "paid": user tự hủy
        //  - "refund_info_required": admin đã hủy, đang yêu cầu user cung cấp info
        if (paymentStatus.equals("paid") || paymentStatus.equals("refund_info_required")) {

            // tránh tạo refund trùng
            boolean hasRefund = refundRepository.existsByOrderIdAndStatusIn(
                    order.getId(),
                    List.of("REQUESTED", "PROCESSING", "DONE")
            );
            if (hasRefund) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Đơn hàng đã có yêu cầu hoàn tiền");
            }

            // Lấy payment PAYOS gần nhất
            Optional<Payment> optPayment = paymentRepository
                    .findFirstByOrderIdAndProviderOrderByCreatedAtDesc(
                            order.getId(), PaymentProvider.PAYOS);

            if (optPayment.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Không tìm thấy giao dịch thanh toán để hoàn tiền"
                );
            }

            Payment payment = optPayment.get();

            if (payment.getStatus() != PaymentStatus.PAID) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Giao dịch thanh toán không ở trạng thái PAID"
                );
            }

            // tạo refund request
            Refund refund = Refund.builder()
                    .orderId(order.getId())
                    .paymentId(payment.getId())
                    .userId(currentUserId)
                    .amount(order.getGrandTotal())
                    .bankName(request.getBankName())
                    .accountNumber(request.getAccountNumber())
                    .accountHolder(request.getAccountHolder())
                    .refundCode("REF" + order.getOrderCode())
                    .reason(request.getReason())
                    .status("REQUESTED") // user mới yêu cầu
                    .createdAt(now)
                    .build();

            refundRepository.save(refund);

            // ❗ Đơn chuyển sang trạng thái CHỜ HỦY / CHỜ HOÀN TIỀN
            order.setStatus(OrderStatus.CANCEL_REQUESTED.name());
            order.setPaymentStatus("refund_requested");
            if (order.getCancelledAt() == null) {
                order.setCancelledAt(now); // thời điểm bắt đầu flow hủy
            }
            order.setCancelReason(
                    request.getReason() != null ? request.getReason()
                            : "Yêu cầu hoàn tiền sau khi đã thanh toán"
            );
            orderRepository.save(order);

            // ❗ Không restock kho → restock sau khi Refund DONE (RefundChecker)
            return;
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Trạng thái thanh toán không cho phép hủy/hoàn tiền");
    }

    /**
     * 👨‍💼 Admin xác nhận bắt đầu xử lý refund
     * - Chỉ dùng khi refund đang REQUESTED
     * - Đơn phải đang ở trạng thái CANCEL_REQUESTED
     * - Đổi refund -> PROCESSING,
     *   order -> CANCEL_REQUESTED + paymentStatus = refund_processing
     * - CANCELLED chỉ set khi refund DONE (ở RefundChecker)
     */
    @Transactional
    public void adminConfirmRefund(Long refundId, Long adminUserId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (!"REQUESTED".equalsIgnoreCase(refund.getStatus())) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }

        Order order = orderRepository.findById(refund.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại cho refund"));

        // chỉ cho confirm refund khi order đang chờ hủy / chờ hoàn tiền
        if (!OrderStatus.CANCEL_REQUESTED.name().equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Đơn hàng không ở trạng thái CANCEL_REQUESTED");
        }

        LocalDateTime now = LocalDateTime.now();

        // cập nhật refund sang PROCESSING (RefundChecker/cron sẽ gọi API chuyển tiền)
        refund.setStatus("PROCESSING");
        refund.setUpdatedAt(now);
        refundRepository.save(refund);

        // ❗ KHÔNG set CANCELLED ở đây, chỉ cập nhật paymentStatus
        // Đơn vẫn ở trạng thái CANCEL_REQUESTED trong suốt quá trình refund
        order.setStatus(OrderStatus.CANCEL_REQUESTED.name());
        order.setPaymentStatus("refund_processing");
        orderRepository.save(order);

        // Restock kho + set CANCELLED sẽ làm trong RefundChecker khi refund = DONE
    }
}
