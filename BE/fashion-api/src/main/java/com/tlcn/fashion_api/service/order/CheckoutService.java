package com.tlcn.fashion_api.service.order;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.common.enums.PaymentStatus;
import com.tlcn.fashion_api.dto.request.coupon.ApplyCouponRequest;
import com.tlcn.fashion_api.dto.request.order.CheckoutItemDto;
import com.tlcn.fashion_api.dto.request.order.CheckoutRequest;
import com.tlcn.fashion_api.dto.response.coupon.ApplyCouponResponse;
import com.tlcn.fashion_api.dto.response.order.CheckoutResponse;
import com.tlcn.fashion_api.entity.coupon.Coupon;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.OrderItem;
import com.tlcn.fashion_api.entity.payment.Payment;
import com.tlcn.fashion_api.payos.PayOSCreatePaymentLinkResponse;
import com.tlcn.fashion_api.payos.PayOSPaymentService;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.PaymentRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CouponService couponService;
    private final PayOSPaymentService payOSPaymentService;
    private final InventoryService inventoryService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public CheckoutResponse checkout(CheckoutRequest req, Long userId) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng trống");
        }

        LocalDateTime now = LocalDateTime.now();

        // 1️⃣ TÍNH LẠI SUBTOTAL
        BigDecimal subtotal = req.getItems().stream()
                .map(i -> {
                    if (i.getQuantity() == null || i.getUnitPrice() == null) {
                        throw new IllegalArgumentException("Thiếu số lượng hoặc đơn giá cho sản phẩm");
                    }
                    return i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2️⃣ ÁP DỤNG COUPON
        BigDecimal discountTotal = BigDecimal.ZERO;
        Coupon appliedCoupon = null;

        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            ApplyCouponResponse cRes = couponService.applyCoupon(
                    new ApplyCouponRequest(req.getCouponCode(), subtotal, userId)
            );
            discountTotal = cRes.getDiscountAmount();
            appliedCoupon = couponService.getByCodeOrThrow(req.getCouponCode());
        }

        BigDecimal taxTotal = Optional.ofNullable(req.getTaxTotal()).orElse(BigDecimal.ZERO);
        BigDecimal shippingFee = Optional.ofNullable(req.getShippingFee()).orElse(BigDecimal.ZERO);

        BigDecimal grandTotal = subtotal
                .subtract(discountTotal)
                .add(taxTotal)
                .add(shippingFee);

        if (grandTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền không hợp lệ");
        }

        // 3️⃣ TẠO ORDER
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setUserId(userId);
        order.setAddressId(req.getAddressId());
        order.setStatus("pending");
        order.setShippingStatus("unfulfilled");
        order.setPaymentStatus("unpaid");
        order.setSubtotal(subtotal);
        order.setDiscountTotal(discountTotal);
        order.setTaxTotal(taxTotal);
        order.setShippingFee(shippingFee);
        order.setGrandTotal(grandTotal);
        order.setCurrency("VND");
        order.setNote(req.getNote());
        order.setCreatedAt(now);

        if ("PAYOS".equalsIgnoreCase(req.getPaymentMethod())) {
            order.setPaymentExpiresAt(now.plusMinutes(10));
        } else if ("COD".equalsIgnoreCase(req.getPaymentMethod())) {
            order.setPaymentExpiresAt(now.plusMinutes(30)); // COD: 30 phút để admin xác nhận
        }

        order.setSnapshotJson(buildSnapshotJson(req));

        // ⭐ PHẢI SAVE TRƯỚC KHI DÙNG order.getId()
        order = orderRepository.save(order);

        // 4️⃣ TẠO ORDER ITEMS
        for (CheckoutItemDto dto : req.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(dto.getProductId());
            item.setVariantId(dto.getVariantId());
            item.setQty(dto.getQuantity());
            item.setUnitPrice(dto.getUnitPrice());
            item.setDiscountAmount(BigDecimal.ZERO);
            item.setTaxAmount(BigDecimal.ZERO);
            item.setLineTotal(dto.getUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
            item.setSnapshotJson(null);
            orderItemRepository.save(item);
        }

        // 4b️⃣ GIỮ CHỖ TỒN KHO
        inventoryService.holdForCheckout(order, req.getItems(), now);

        // 5️⃣ HANDLER THEO PHƯƠNG THỨC THANH TOÁN

        // COD: giao hàng thu tiền
        if ("COD".equalsIgnoreCase(req.getPaymentMethod())) {
            Payment payment = Payment.builder()
                    .order(order)
                    .provider(PaymentProvider.COD)
                    .amount(grandTotal)
                    .currency("VND")
                    .status(PaymentStatus.PENDING)
                    .createdAt(now)
                    .build();
            paymentRepository.save(payment);

            // ⭐️ FIX: COD - Lưu coupon usage ngay vì COD là thanh toán ngay
            if (appliedCoupon != null && discountTotal.compareTo(BigDecimal.ZERO) > 0) {
                couponService.saveCouponUsage(
                        appliedCoupon.getId(),
                        order.getId(),
                        userId,
                        discountTotal
                );
            }

            return CheckoutResponse.builder()
                    .orderId(order.getId())
                    .orderCode(order.getOrderCode())
                    .orderStatus(order.getStatus())
                    .paymentMethod("COD")
                    .paymentStatus(order.getPaymentStatus()) // "unpaid"
                    .build();
        }

        if ("PAYOS".equalsIgnoreCase(req.getPaymentMethod())) {
            Payment payment = Payment.builder()
                    .order(order)
                    .provider(PaymentProvider.PAYOS)
                    .amount(grandTotal)
                    .currency("VND")
                    .status(PaymentStatus.PENDING)
                    .createdAt(now)
                    .build();
            payment = paymentRepository.save(payment);

            PayOSCreatePaymentLinkResponse payos = payOSPaymentService.createPaymentLink(order);
            payment.setTxnRef(payos.getPaymentLinkId());
            paymentRepository.save(payment);

            // ⭐️ FIX: PAYOS - KHÔNG lưu coupon usage ở đây
            // Chỉ lưu khi thanh toán thành công (trong OrderPaymentService khi payment = PAID)
            // Nếu thanh toán thất bại, coupon usage không bị tính

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

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán không hợp lệ");
    }


    private String generateOrderCode() {
        return "ORD" + System.currentTimeMillis();
    }

    private String buildSnapshotJson(CheckoutRequest req) {
        try {
            return objectMapper.writeValueAsString(req);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
