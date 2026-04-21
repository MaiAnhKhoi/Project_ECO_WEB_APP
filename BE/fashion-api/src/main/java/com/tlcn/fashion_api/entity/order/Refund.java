package com.tlcn.fashion_api.entity.order;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long userId;
    private BigDecimal amount;

    private String bankName;
    private String accountNumber;
    private String accountHolder;

    private String refundCode;
    private String status; // REQUESTED, PROCESSING, DONE

    // ⭐ THÊM 2 FIELD NÀY
    private Long paymentId;
    private String reason;

    private String sepayTransactionId;
    private LocalDateTime transactionDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
