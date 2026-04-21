package com.tlcn.fashion_api.service.inventory;

import com.tlcn.fashion_api.dto.request.order.CheckoutItemDto;
import com.tlcn.fashion_api.entity.inventory.InventoryReservation;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.OrderItem;
import com.tlcn.fashion_api.entity.product.Stock;
import com.tlcn.fashion_api.repository.inventory.InventoryReservationRepository;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.stock.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    public static final String RES_HELD = "held";
    public static final String RES_CONSUMED = "consumed";
    public static final String RES_EXPIRED = "expired";
    public static final String RES_RELEASED = "released";

    private final StockRepository stockRepository;
    private final InventoryReservationRepository reservationRepository;
    private final OrderItemRepository orderItemRepository; // 👈 thêm repo này

    @Transactional
    public void holdForCheckout(Order order,
                                List<CheckoutItemDto> items,
                                LocalDateTime now) {

        LocalDateTime defaultExpire = Optional.ofNullable(order.getPaymentExpiresAt())
                .orElse(now.plusMinutes(30));

        for (CheckoutItemDto dto : items) {
            Long variantId = dto.getVariantId();
            if (variantId == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Sản phẩm phải chọn variant để giữ kho"
                );
            }

            Stock stock = stockRepository.findByVariantIdForUpdate(variantId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Không tìm thấy tồn kho cho sản phẩm"
                    ));

            int heldQty = reservationRepository
                    .sumActiveHeld(variantId, RES_HELD, now);

            int available = stock.getQuantity() - heldQty;

            if (available < dto.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Sản phẩm không đủ tồn kho. Còn lại: " + available
                );
            }

            InventoryReservation r = InventoryReservation.builder()
                    .variant(stock.getVariant())
                    .order(order)
                    .qty(dto.getQuantity())
                    .status(RES_HELD)
                    .expiresAt(defaultExpire)
                    .build();

            reservationRepository.save(r);
        }
    }

    @Transactional
    public void consumeForOrder(Order order) {
        LocalDateTime now = LocalDateTime.now();
        List<InventoryReservation> reservations =
                reservationRepository.findByOrderAndStatus(order, RES_HELD);

        for (InventoryReservation r : reservations) {
            Stock stock = stockRepository.findByVariantIdForUpdate(r.getVariant().getId())
                    .orElseThrow(() -> new IllegalStateException("Thiếu stock khi consume"));

            int newQty = stock.getQuantity() - r.getQty();
            if (newQty < 0) {
                throw new IllegalStateException("Tồn kho âm khi consume");
            }

            stock.setQuantity(newQty);
            // nếu entity Stock của bạn KHÔNG có updatedAt thì bỏ dòng dưới
            // stock.setUpdatedAt(now);

            r.setStatus(RES_CONSUMED);
            r.setConsumedAt(now);

            stockRepository.save(stock);
            reservationRepository.save(r);
        }
    }

    @Transactional
    public void releaseForOrder(Order order, boolean expired) {
        String newStatus = expired ? RES_EXPIRED : RES_RELEASED;

        List<InventoryReservation> reservations =
                reservationRepository.findByOrderAndStatus(order, RES_HELD);

        for (InventoryReservation r : reservations) {
            r.setStatus(newStatus);
            reservationRepository.save(r);
        }
    }

    /**
     * 🔁 Hoàn lại kho cho 1 đơn đã TRỪ kho trước đó (khi refund)
     * - Dùng order_items để cộng quantity ngược lại
     * - KHÔNG đụng tới reservation nữa (vì lúc trừ kho đã là RES_CONSUMED)
     */
    @Transactional
    public void restockForOrder(Order order) {
        LocalDateTime now = LocalDateTime.now();
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        for (OrderItem item : items) {
            if (item.getVariantId() == null) {
                continue; // sản phẩm không có variant thì tuỳ bạn muốn xử lý thế nào
            }

            Stock stock = stockRepository.findByVariantIdForUpdate(item.getVariantId())
                    .orElseThrow(() -> new IllegalStateException("Thiếu stock khi restock"));

            int newQty = stock.getQuantity() + item.getQty();
            stock.setQuantity(newQty);
            // nếu có updatedAt:
             stock.setUpdatedAt(now);

            stockRepository.save(stock);
        }
    }
}
