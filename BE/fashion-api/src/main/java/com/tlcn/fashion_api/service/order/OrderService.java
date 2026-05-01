package com.tlcn.fashion_api.service.order;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.common.enums.OrderStatus;
import com.tlcn.fashion_api.dto.response.order.*;
import com.tlcn.fashion_api.entity.address.Address;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.OrderItem;
import com.tlcn.fashion_api.entity.order.Refund;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductImage;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.entity.product.VariantAttributeValue;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.address.AddressRepository;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.order.RefundRepository;
import com.tlcn.fashion_api.repository.product.ProductImageRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.ProductVariantRepository;
import com.tlcn.fashion_api.repository.product.VariantAttributeValueRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import com.tlcn.fashion_api.service.coupon.CouponService;
import com.tlcn.fashion_api.service.email.EmailService;
import com.tlcn.fashion_api.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantAttributeValueRepository variantAttributeValueRepository;
    private final ProductImageRepository productImageRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private final InventoryService inventoryService;
    private final RefundRepository refundRepository;
    private final CouponService couponService;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    // ========== 1. LIST tất cả đơn ==========
    @Transactional(readOnly = true)
    public OrderPageResponse getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findAll(pageable);

        List<OrderSummaryResponse> content = orderPage.getContent().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());

        return OrderPageResponse.builder()
                .content(content)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .number(orderPage.getNumber())
                .build();
    }

    private OrderSummaryResponse toSummaryDto(Order o) {
        return OrderSummaryResponse.builder()
                .orderId(o.getId())
                .orderCode(o.getOrderCode())
                .status(o.getStatus())
                .paymentStatus(o.getPaymentStatus())
                .grandTotal(o.getGrandTotal())
                .createdAt(o.getCreatedAt())
                .paymentMethod(extractPaymentMethod(o))
                .cancelReason(o.getCancelReason()) // Thêm lý do hủy đơn
                .build();
    }

    // ========== 2. ADMIN – chi tiết đơn ==========
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        Address address = null;
        if (order.getAddressId() != null) {
            address = addressRepository.findById(order.getAddressId()).orElse(null);
        }

        OrderAddressResponse addressDto = toOrderAddressResponse(address);
        List<OrderItemResponse> itemDtos = items.stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        Long customerId = order.getUserId();
        String customerName = null;
        String customerEmail = null;
        String customerPhone = null;

        if (customerId != null) {
            User user = userRepository.findById(customerId).orElse(null);
            if (user != null) {
                customerName = user.getName();
                customerEmail = user.getEmail();
                customerPhone = user.getPhone();
            }
        }

        Refund refund = refundRepository
                .findTopByOrderIdOrderByCreatedAtDesc(order.getId())
                .orElse(null);

        String refundBankName = refund != null ? refund.getBankName() : null;
        String refundAccountNumber = refund != null ? refund.getAccountNumber() : null;
        String refundAccountHolder = refund != null ? refund.getAccountHolder() : null;

        BigDecimal refundAmount = refund != null ? refund.getAmount() : null;
        String refundCode = refund != null ? refund.getRefundCode() : null;
        String refundReason = refund != null ? refund.getReason() : null;
        String refundStatus = refund != null ? refund.getStatus() : null;
        LocalDateTime refundRequestedAt = refund != null ? refund.getCreatedAt() : null;

        // 👇 LẤY PAYMENT METHOD TỪ SNAPSHOT
        String paymentMethod = extractPaymentMethod(order);

        // QR hoàn tiền (dựa vào bank code FE gửi)
        String refundQrUrl = null;
        if (refund != null
                && refundAmount != null
                && refundAmount.compareTo(BigDecimal.ZERO) > 0
                && refund.getAccountNumber() != null
                && refund.getBankName() != null
                && (refundStatus == null || !"completed".equalsIgnoreCase(refundStatus))) {
            String bankCode = resolveBankCodeForRefund(refund.getBankName());
            if (bankCode != null) {
                String amountStr = refundAmount.setScale(0, RoundingMode.DOWN).toPlainString();
                String noteRaw = refundCode != null ? refundCode : order.getOrderCode();
                String note = URLEncoder.encode(noteRaw, StandardCharsets.UTF_8);
                refundQrUrl = String.format(
                        "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s&addInfo=%s",
                        bankCode,
                        refund.getAccountNumber(),
                        amountStr,
                        note
                );
            }
        }

        return OrderDetailResponse.builder()
                .orderId(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .subtotal(order.getSubtotal())
                .discountTotal(order.getDiscountTotal())
                .taxTotal(order.getTaxTotal())
                .shippingFee(order.getShippingFee())
                .grandTotal(order.getGrandTotal())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .paymentExpiresAt(order.getPaymentExpiresAt())
                .shippingStatus(order.getShippingStatus())
                .cancelReason(order.getCancelReason())
                .shippingAddress(addressDto)
                .items(itemDtos)

                .customerId(customerId)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(customerPhone)

                .paymentMethod(paymentMethod) // 👈 THÊM DÒNG NÀY
                .refundQrUrl(refundQrUrl)

                .refundBankName(refundBankName)
                .refundAccountNumber(refundAccountNumber)
                .refundAccountHolder(refundAccountHolder)
                .refundAmount(refundAmount)
                .refundCode(refundCode)
                .refundReason(refundReason)
                .refundStatus(refundStatus)
                .refundRequestedAt(refundRequestedAt)
                .build();
    }


    private OrderAddressResponse toOrderAddressResponse(Address address) {
        if (address == null) return null;

        OrderAddressResponse dto = new OrderAddressResponse();
        dto.setId(address.getId());

        String receiver = address.getReceiver();
        if (receiver != null && receiver.contains(" ")) {
            int lastSpace = receiver.lastIndexOf(" ");
            dto.setFirstName(receiver.substring(0, lastSpace));
            dto.setLastName(receiver.substring(lastSpace + 1));
        } else {
            dto.setFirstName(receiver);
            dto.setLastName("");
        }

        dto.setPhone(address.getPhone());
        dto.setAddress1(address.getLine1());
        dto.setCity(address.getCity());
        dto.setProvince(address.getProvince());
        dto.setRegion(address.getDistrict());
        dto.setCompany(address.getLine2());

        return dto;
    }

    private OrderItemResponse toItemDto(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setVariantId(item.getVariantId());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQty());
        dto.setLineTotal(item.getLineTotal());

        // PRODUCT
        Product product = null;
        if (item.getProductId() != null) {
            product = productRepository.findById(item.getProductId()).orElse(null);
        }

        if (product != null) {
            dto.setProductName(product.getName());

            // ảnh default product
            Optional<ProductImage> imgOpt =
                    productImageRepository.findFirstByProductIdAndIsPrimaryTrue(product.getId());

            if (!imgOpt.isPresent()) {
                imgOpt = productImageRepository.findFirstByProductId(product.getId());
            }

            imgOpt.ifPresent(img -> dto.setImageUrl(img.getImageUrl()));

        }

        // VARIANT: color/size + ảnh theo variant
        if (item.getVariantId() != null) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId()).orElse(null);

            if (variant != null) {
                List<VariantAttributeValue> attrs =
                        variantAttributeValueRepository.findByVariantId(variant.getId());

                String color = null;
                String size = null;

                for (VariantAttributeValue vav : attrs) {
                    String attrName = vav.getAttribute().getName();
                    String attrValue = vav.getAttributeValue().getValue();

                    if ("color".equalsIgnoreCase(attrName) || "màu".equalsIgnoreCase(attrName)) {
                        color = attrValue;
                    }
                    if ("size".equalsIgnoreCase(attrName) || "kích cỡ".equalsIgnoreCase(attrName)) {
                        size = attrValue;
                    }
                }

                dto.setColor(color);
                dto.setSize(size);

                if (product != null) {
                    Optional<ProductImage> imgOpt =
                            productImageRepository.findFirstByProductIdAndIsPrimaryTrue(product.getId());

                    if (!imgOpt.isPresent()) {
                        imgOpt = productImageRepository.findFirstByProductId(product.getId());
                    }

                    imgOpt.ifPresent(img -> dto.setImageUrl(img.getImageUrl()));

                }
            }
        }

        return dto;
    }

    // ==========================
    // 3. ADMIN – CẬP NHẬT STATUS ĐƠN
    // ==========================
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatusStr, String note) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        // ⭐️ FIX 1: convert status trong DB về UPPERCASE
        String currentStatusStr = order.getStatus();
        if (currentStatusStr == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trạng thái hiện tại của đơn hàng đang null"
            );
        }

        OrderStatus current;
        try {
            current = OrderStatus.valueOf(currentStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trạng thái đơn hàng trong DB không hợp lệ: " + currentStatusStr
            );
        }

        // ⭐️ FIX 2: newStatusStr cũng ép về UPPERCASE (bạn đã làm rồi nhưng để nguyên cho đủ context)
        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trạng thái đơn hàng không hợp lệ: " + newStatusStr
            );
        }

        // phần validate switch-case giữ nguyên
        switch (newStatus) {
            case CONFIRMED:
                if (current != OrderStatus.PENDING) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Chỉ đơn PENDING mới chuyển sang CONFIRMED");
                }
                break;
            case PROCESSING:
                if (current != OrderStatus.PENDING && current != OrderStatus.CONFIRMED) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Chỉ đơn PENDING/CONFIRMED mới sang PROCESSING");
                }
                break;
            case COMPLETED:
                if (current != OrderStatus.PROCESSING) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Chỉ đơn PROCESSING mới sang COMPLETED");
                }
                break;
            case CANCELLED:
            case CANCEL_REQUESTED:
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Vui lòng dùng API hủy đơn, không set trực tiếp CANCELLED/CANCEL_REQUESTED");
            default:
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ để admin cập nhật");
        }

        // ⭐️ FIX: Chỉ tăng sold count khi chuyển từ status khác sang COMPLETED
        // Kiểm tra lại trong DB để tránh race condition và duplicate increment
        boolean shouldIncreaseSoldCount = false;
        if (newStatus == OrderStatus.COMPLETED && current != OrderStatus.COMPLETED) {
            // Double check: Query lại từ DB để đảm bảo order chưa COMPLETED
            Order freshOrder = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
            
            String freshStatus = freshOrder.getStatus();
            if (freshStatus == null || !OrderStatus.COMPLETED.name().equalsIgnoreCase(freshStatus)) {
                shouldIncreaseSoldCount = true;
            }
        }

        order.setStatus(newStatus.name());
        if (note != null && !note.isBlank()) {
            order.setCancelReason(note);
        }
        order.setUpdatedAt(LocalDateTime.now());

        if (shouldIncreaseSoldCount) {
            order.setShippingStatus("delivered");
            increaseSoldCountForOrder(order);
        }

        orderRepository.save(order);
    }



    // ==========================
    // 4. ADMIN – CẬP NHẬT SHIPPING STATUS
    // ==========================
    @Transactional
    public void updateShippingStatus(Long orderId, String newShippingStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        if (OrderStatus.CANCELLED.name().equalsIgnoreCase(order.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn đã hủy, không thể đổi shippingStatus");
        }

        order.setShippingStatus(newShippingStatus);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    // ==========================
    // 5. ADMIN – HỦY ĐƠN HÀNG (tie-in với luồng refund_info_required)
    // ==========================
    @Transactional
    public void adminCancelOrder(Long orderId, Long adminUserId, String reason) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        LocalDateTime now = LocalDateTime.now();

        String status = order.getStatus() == null ? "" : order.getStatus();
        String paymentStatus = order.getPaymentStatus() == null
                ? "unpaid"
                : order.getPaymentStatus().toLowerCase();

        boolean isCancelled = OrderStatus.CANCELLED.name().equalsIgnoreCase(status);
        boolean isCancelRequested = OrderStatus.CANCEL_REQUESTED.name().equalsIgnoreCase(status);
        boolean isCompleted = OrderStatus.COMPLETED.name().equalsIgnoreCase(status);

        if (isCompleted) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã hoàn tất, không thể hủy");
        }

        if (isCancelled || isCancelRequested) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã ở trạng thái hủy, không thể hủy thêm");
        }

        if (!"unfulfilled".equalsIgnoreCase(order.getShippingStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Đơn hàng đã được xử lý giao, không thể hủy");
        }

        // ========== CASE 1: chưa thanh toán ==========
        if (paymentStatus.equals("unpaid")
                || paymentStatus.equals("failed")
                || paymentStatus.equals("expired")) {

            order.setStatus(OrderStatus.CANCELLED.name());
            order.setCancelledAt(now);
            order.setCancelReason(
                    reason != null ? reason : "Admin hủy đơn chưa thanh toán"
            );

            orderRepository.save(order);

            inventoryService.releaseForOrder(order, false);

            // ⭐️ FIX: Xóa coupon usage khi order bị hủy (rollback limit)
            if (order.getDiscountTotal() != null && order.getDiscountTotal().compareTo(BigDecimal.ZERO) > 0) {
                try {
                    couponService.removeCouponUsageByOrderId(order.getId());
                } catch (Exception e) {
                    // Log error nhưng không throw để không ảnh hưởng đến flow hủy đơn
                    System.err.println("Failed to remove coupon usage for order " + order.getId() + ": " + e.getMessage());
                }
            }
            
            // 📧 Gửi email thông báo hủy đơn (chưa thanh toán)
            try {
                if (order.getUserId() != null) {
                    userRepository.findById(order.getUserId()).ifPresent(customer -> {
                        if (customer.getEmail() != null) {
                            emailService.sendOrderCancelledEmail(
                                    customer.getEmail(),
                                    customer.getName() != null ? customer.getName() : "Khách hàng",
                                    order.getOrderCode(),
                                    order.getCancelReason(),
                                    BigDecimal.ZERO // Chưa thanh toán nên refund = 0
                            );
                        }
                    });
                }
            } catch (Exception e) {
                System.err.println("Failed to send order cancelled email: " + e.getMessage());
            }
            
            return;
        }

        // ========== CASE 2: đã thanh toán ==========
        if (paymentStatus.equals("paid")) {

            boolean hasRefund = refundRepository.existsByOrderIdAndStatusIn(
                    order.getId(),
                    List.of("REQUESTED", "PROCESSING", "DONE")
            );
            if (hasRefund) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Đơn hàng đã có yêu cầu hoàn tiền, không thể hủy theo cách này");
            }

            // Admin hủy đơn đã thanh toán:
            //  - KHÔNG tạo Refund ở đây (chưa có bank info)
            //  - Đơn sang CANCEL_REQUESTED + paymentStatus = refund_info_required
            order.setStatus(OrderStatus.CANCEL_REQUESTED.name());
            order.setPaymentStatus("refund_info_required");
            order.setCancelledAt(now);
            order.setCancelReason(
                    reason != null ? reason
                            : "Admin hủy đơn đã thanh toán - chờ thông tin hoàn tiền từ khách"
            );

            orderRepository.save(order);
            
            // 📧 Gửi email yêu cầu thông tin hoàn tiền
            try {
                if (order.getUserId() != null) {
                    userRepository.findById(order.getUserId()).ifPresent(customer -> {
                        if (customer.getEmail() != null) {
                            BigDecimal refundAmount = order.getGrandTotal() != null 
                                    ? order.getGrandTotal() 
                                    : BigDecimal.ZERO;
                            
                            emailService.sendOrderCancelledRefundInfoRequiredEmail(
                                    customer.getEmail(),
                                    customer.getName() != null ? customer.getName() : "Khách hàng",
                                    order.getOrderCode(),
                                    order.getCancelReason(),
                                    refundAmount
                            );
                        }
                    });
                }
            } catch (Exception e) {
                System.err.println("Failed to send refund info required email: " + e.getMessage());
            }
            
            // Không restock ở đây – RefundChecker restock sau khi refund DONE
            return;
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Trạng thái thanh toán hiện tại không cho phép admin hủy đơn");
    }

    private String extractPaymentMethod(Order order) {
        String snapshot = order.getSnapshotJson(); // 👈 đúng với CheckoutService đang set
        if (snapshot == null || snapshot.isBlank()) {
            return null;
        }

        try {
            JsonNode root = objectMapper.readTree(snapshot);
            JsonNode pmNode = root.get("paymentMethod");
            if (pmNode != null && !pmNode.isNull()) {
                return pmNode.asText(); // ví dụ: "COD" / "PAYOS"
            }
        } catch (Exception e) {
            // có thể log nếu cần
        }

        return null;
    }
    private void increaseSoldCountForOrder(Order order) {
        // ⭐️ FIX: Double check order status trước khi tăng sold count
        // Tránh tăng 2 lần nếu method này được gọi nhiều lần
        Order freshOrder = orderRepository.findById(order.getId())
                .orElse(null);
        
        if (freshOrder == null) {
            return;
        }
        
        String currentStatus = freshOrder.getStatus();
        if (currentStatus == null || !OrderStatus.COMPLETED.name().equalsIgnoreCase(currentStatus)) {
            // Order chưa COMPLETED, không tăng sold count
            return;
        }
        
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        for (OrderItem item : items) {
            if (item.getProductId() == null || item.getQty() == null) continue;
            productRepository.increaseSoldCount(item.getProductId(), item.getQty());
        }
    }

    // Map mã ngân hàng theo giá trị FE gửi (MB, Vietcombank, Techcombank, Sacombank, TPBank, BIDV)
    private String resolveBankCodeForRefund(String bankName) {
        if (bankName == null) return null;
        String n = bankName.trim().toLowerCase();
        if (n.equals("mb") || n.contains("mb bank")) return "MBB";
        if (n.equals("vietcombank") || n.contains("vcb")) return "VCB";
        if (n.equals("techcombank") || n.contains("tcb")) return "TCB";
        if (n.equals("sacombank") || n.contains("stb")) return "STB";
        if (n.equals("tpbank") || n.contains("tpb")) return "TPB";
        if (n.equals("bidv")) return "BIDV";
        return null;
    }
}