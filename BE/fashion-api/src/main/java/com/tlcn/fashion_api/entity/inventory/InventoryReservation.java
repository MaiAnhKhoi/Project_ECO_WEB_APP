package com.tlcn.fashion_api.entity.inventory;

import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // variant_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    // order_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "qty", nullable = false)
    private Integer qty;

    /**
     * held     : giữ chỗ (sau checkout, chưa thanh toán)
     * consumed : đã trừ kho thật (khi thanh toán thành công)
     * expired  : hết hạn thanh toán
     * released : user/bên admin hủy, trả lại kho
     */
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false,
            updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "consumed_at")
    private LocalDateTime consumedAt;
}
