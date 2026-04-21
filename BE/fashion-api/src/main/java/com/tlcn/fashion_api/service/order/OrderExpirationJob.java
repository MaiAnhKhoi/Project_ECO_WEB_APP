package com.tlcn.fashion_api.service.order;

import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.payment.Payment;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.PaymentRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderExpirationJob {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final PaymentRepository paymentRepository;
    private final CouponService couponService;

    @Scheduled(fixedDelay = 60_000) // mỗi 60s quét 1 lần
    @Transactional
    public void cancelExpiredOrders() {
        LocalDateTime now = LocalDateTime.now();
        List<Order> expired = orderRepository.findExpiredUnpaid(now);
        // findExpiredUnpaid: status = 'pending', paymentStatus = 'unpaid', paymentExpiresAt <= :now

        for (Order o : expired) {
            o.setStatus("cancelled");
            o.setPaymentStatus("expired");
            o.setCancelledAt(now);
            
            // Xác định lý do hủy dựa trên payment method
            Optional<Payment> paymentOpt = paymentRepository
                    .findFirstByOrderIdAndProviderOrderByCreatedAtDesc(
                            o.getId(),
                            PaymentProvider.PAYOS
                    );
            
            if (paymentOpt.isPresent()) {
                o.setCancelReason("Thanh toán PayOS quá hạn 10 phút");
            } else {
                o.setCancelReason("Đơn COD chưa được xác nhận trong 30 phút");
            }

            // 🔥 TRẢ KHO: các reservation đang held -> expired
            inventoryService.releaseForOrder(o, true);
            
            // ⭐ Xóa coupon usage nếu có
            if (o.getDiscountTotal() != null && 
                o.getDiscountTotal().compareTo(java.math.BigDecimal.ZERO) > 0) {
                try {
                    couponService.removeCouponUsageByOrderId(o.getId());
                } catch (Exception e) {
                    log.error("Failed to remove coupon usage for order {}: {}", 
                            o.getId(), e.getMessage());
                }
            }
        }

        if (!expired.isEmpty()) {
            orderRepository.saveAll(expired);
        }
    }
}
