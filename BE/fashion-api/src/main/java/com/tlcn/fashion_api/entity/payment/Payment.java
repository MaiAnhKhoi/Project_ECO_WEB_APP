package com.tlcn.fashion_api.entity.payment;

import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.common.enums.PaymentStatus;
import com.tlcn.fashion_api.entity.order.Order;
import jakarta.persistence.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK tới orders.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false)
    private PaymentProvider provider; // COD / PAYOS

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    // Lưu paymentLinkId hoặc orderCode của PayOS
    @Column(name = "txn_ref")
    private String txnRef;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "webhook_received_at")
    private LocalDateTime webhookReceivedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
