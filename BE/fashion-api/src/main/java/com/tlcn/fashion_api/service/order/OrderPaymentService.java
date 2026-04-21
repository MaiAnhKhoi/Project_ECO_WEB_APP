package com.tlcn.fashion_api.service.order;

import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.common.enums.PaymentStatus;
import com.tlcn.fashion_api.dto.response.order.CheckoutResponse;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.payment.Payment;
import com.tlcn.fashion_api.payos.PayOSClient;
import com.tlcn.fashion_api.payos.PayOSCreatePaymentLinkResponse;
import com.tlcn.fashion_api.payos.PayOSPaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.PaymentRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderPaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final PayOSPaymentService payOSPaymentService;
    private final PayOSClient payOSClient; // client mới để check trực tiếp
    private final InventoryService inventoryService;
    private final CouponService couponService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ========= Re-pay với PayOS =========
    @Transactional
    public CheckoutResponse rePayWithPayOS(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        if (!Objects.equals(order.getUserId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không sở hữu đơn hàng này");
        }

        if (!"pending".equalsIgnoreCase(order.getStatus())
                || !"unpaid".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng không ở trạng thái chờ thanh toán");
        }

        // HẾT 10 PHÚT => HỦY + TRẢ KHO
        if (order.getPaymentExpiresAt() == null || order.getPaymentExpiresAt().isBefore(LocalDateTime.now())) {
            order.setStatus("cancelled");
            order.setPaymentStatus("expired");
            order.setCancelledAt(LocalDateTime.now());
            order.setCancelReason("Thanh toán quá hạn 10 phút");
            orderRepository.save(order);

            // 🔥 Giải phóng các reservation đang held -> expired
            inventoryService.releaseForOrder(order, true);

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã hết hạn thanh toán");
        }

        // Tạo payment mới cho lần re-pay
        Payment payment = Payment.builder()
                .order(order)
                .provider(PaymentProvider.PAYOS)
                .amount(order.getGrandTotal())
                .currency("VND")
                .status(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        payment = paymentRepository.save(payment);

        PayOSCreatePaymentLinkResponse payos = payOSPaymentService.createPaymentLink(order);
        payment.setTxnRef(payos.getPaymentLinkId());
        paymentRepository.save(payment);

        return CheckoutResponse.builder()
                .orderId(order.getId())
                .orderCode(order.getOrderCode())
                .orderStatus(order.getStatus())
                .paymentMethod("PAYOS")
                .paymentStatus(order.getPaymentStatus())
                .payosCheckoutUrl(payos.getCheckoutUrl())
                .payosQrUrl(payos.getQrCode())
                .paymentExpiresAt(order.getPaymentExpiresAt())
                .build();
    }

    // ========= Check trạng thái trực tiếp trên PayOS =========
    @Transactional
    public boolean checkPayOSStatus(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        if (!Objects.equals(order.getUserId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không sở hữu đơn hàng này");
        }

        // Lấy payment PayOS gần nhất
        Optional<Payment> optPayment = paymentRepository
                .findFirstByOrderIdAndProviderOrderByCreatedAtDesc(orderId, PaymentProvider.PAYOS);

        if (optPayment.isEmpty()) {
            return false; // chưa tạo payment link
        }

        Payment payment = optPayment.get();

        // 1️⃣ Nếu DB đã PAID sẵn (đã sync trước đó) => đảm bảo kho đã trừ
        if (payment.getStatus() == PaymentStatus.PAID) {

            // Nếu vì lý do gì đó order chưa đánh dấu paid, ta sync lại
            if (!"paid".equalsIgnoreCase(order.getPaymentStatus())) {
                // 🔥 TRỪ KHO THẬT: held -> consumed, trừ stocks
                inventoryService.consumeForOrder(order);

                order.setPaymentStatus("paid");
                // Giữ nguyên status = "pending" để admin phải Confirm thủ công
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);

                // ⭐️ FIX: Lưu coupon usage khi thanh toán thành công (PAYOS)
                saveCouponUsageIfExists(order);
            }

            return true;
        }

        // 2️⃣ Gọi PayOS để check status realtime
        String status = payOSClient.getPaymentStatus(payment.getTxnRef());

        if ("PAID".equalsIgnoreCase(status)) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // 🔥 TRỪ KHO THẬT: consume reservation
            inventoryService.consumeForOrder(order);

            order.setPaymentStatus("paid");
            // Giữ nguyên status = "pending" để admin phải Confirm thủ công
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            // ⭐️ FIX: Lưu coupon usage khi thanh toán thành công (PAYOS)
            saveCouponUsageIfExists(order);

            return true;
        }

        // 3️⃣ Trạng thái thất bại/hủy/hết hạn bên PayOS
        if ("CANCELED".equalsIgnoreCase(status)
                || "FAILED".equalsIgnoreCase(status)
                || "EXPIRED".equalsIgnoreCase(status)) {

            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            // Chỉ hủy & trả kho nếu đơn vẫn đang pending + unpaid
            if ("pending".equalsIgnoreCase(order.getStatus())
                    && "unpaid".equalsIgnoreCase(order.getPaymentStatus())) {
                order.setPaymentStatus("failed");
                order.setStatus("cancelled");
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelReason("Thanh toán PayOS thất bại/hủy");
                orderRepository.save(order);

                // 🔥 TRẢ KHO: held -> released
                inventoryService.releaseForOrder(order, false);

                // ⭐️ FIX: Xóa coupon usage khi thanh toán thất bại (nếu đã lưu)
                if (order.getDiscountTotal() != null && order.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) > 0) {
                    try {
                        couponService.removeCouponUsageByOrderId(order.getId());
                    } catch (Exception e) {
                        System.err.println("Failed to remove coupon usage for order " + order.getId() + ": " + e.getMessage());
                    }
                }
            }

            return false;
        }

        // 4️⃣ PENDING / UNKNOWN → vẫn chưa thanh toán
        return false;
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
                System.err.println("Failed to save coupon usage: " + e.getMessage());
            }
        } catch (Exception e) {
            // Log error nhưng không throw
            System.err.println("Failed to parse snapshot for coupon: " + e.getMessage());
        }
    }
}
