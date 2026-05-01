package com.tlcn.fashion_api.service.order;

import com.tlcn.fashion_api.dto.order.OrderStatusResponse;
import com.tlcn.fashion_api.dto.response.order.*;
import com.tlcn.fashion_api.entity.address.Address;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.OrderItem;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductImage;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.entity.product.VariantAttributeValue;
import com.tlcn.fashion_api.repository.address.AddressRepository;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.product.ProductImageRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.ProductVariantRepository;
import com.tlcn.fashion_api.repository.product.VariantAttributeValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderQueryService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantAttributeValueRepository variantAttributeValueRepository;
    private final ProductImageRepository productImageRepository;
    private final AddressRepository addressRepository;

    public OrderStatusResponse getOrderStatus(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        if (!order.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không sở hữu đơn hàng này");
        }

        OrderStatusResponse res = new OrderStatusResponse();
        res.setOrderId(order.getId());
        res.setOrderStatus(order.getStatus());
        res.setPaymentStatus(order.getPaymentStatus());

        return res;
    }

    // ==========================
    // 1. LIST ĐƠN HÀNG CỦA USER
    // ==========================
    public OrderPageResponse getMyOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

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
                .build();
    }

    // ==========================
    // 2. CHI TIẾT ĐƠN HÀNG
    // ==========================
    @Transactional
    public OrderDetailResponse getMyOrderDetail(Long orderId, Long userId) {

        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        Address address = null;
        if (order.getAddressId() != null) {
            address = addressRepository.findById(order.getAddressId()).orElse(null);
        }

        OrderAddressResponse addressDto = new OrderAddressResponse();
        addressDto = toOrderAddressResponse(address);

        List<OrderItemResponse> itemDtos = items.stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

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
                .build();
    }

    public OrderAddressResponse toOrderAddressResponse(Address address) {
        if (address == null) return null;

        OrderAddressResponse dto = new OrderAddressResponse();
        dto.setId(address.getId());

        // Tách firstName / lastName nếu cần
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
        dto.setRegion(address.getDistrict()); // hoặc ward tùy mapping
        dto.setCompany(address.getLine2());   // line2 có thể là company info

        return dto;
    }

    // ==========================
    // 3. MAP ITEM -> DTO, LẤY productName / color / size / image
    // ==========================
    private OrderItemResponse toItemDto(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setVariantId(item.getVariantId());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQty());
        dto.setLineTotal(item.getLineTotal());

        // ----- PRODUCT NAME + IMAGE -----
        Product product = null;
        if (item.getProductId() != null) {
            product = productRepository.findById(item.getProductId()).orElse(null);
        }

        if (product != null) {
            dto.setProductName(product.getName());

            // ảnh default product
            Optional<ProductImage> pi = productImageRepository
                    .findFirstByProductIdAndIsPrimaryTrue(product.getId());
            if (pi.isEmpty()) {
                pi = productImageRepository.findFirstByProductId(product.getId());
            }
            pi.ifPresent(img -> dto.setImageUrl(img.getImageUrl()));
        }

        // ----- COLOR + SIZE + ẢNH THEO VARIANT -----
        if (item.getVariantId() != null) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                    .orElse(null);

            if (variant != null) {
                // attributeValues: color / size
                List<VariantAttributeValue> attrs =
                        variantAttributeValueRepository.findByVariantId(variant.getId());

                String color = null;
                String size = null;

                for (VariantAttributeValue vav : attrs) {
                    String attrName = vav.getAttribute().getName();   // chỉnh lại nếu field khác
                    String attrValue = vav.getAttributeValue().getValue(); // chỉnh nếu field khác

                    if ("color".equalsIgnoreCase(attrName) || "màu".equalsIgnoreCase(attrName)) {
                        color = attrValue;
                    }
                    if ("size".equalsIgnoreCase(attrName) || "kích cỡ".equalsIgnoreCase(attrName)) {
                        size = attrValue;
                    }
                }

                dto.setColor(color);
                dto.setSize(size);

                // ảnh theo variant (product_images.variant_id)
                if (product != null) {
                    Optional<ProductImage> vImg = productImageRepository
                            .findFirstByProductIdAndVariantIdAndIsPrimaryTrue(product.getId(), variant.getId());
                    if (vImg.isEmpty()) {
                        vImg = productImageRepository
                                .findFirstByProductIdAndVariantId(product.getId(), variant.getId());
                    }
                    vImg.ifPresent(img -> dto.setImageUrl(img.getImageUrl()));
                }
            }
        }

        return dto;
    }

}
