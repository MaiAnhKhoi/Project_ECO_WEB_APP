package com.tlcn.fashion_api.entity.ai;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_behavior_logs", indexes = {
        @Index(name = "idx_behavior_user_id", columnList = "user_id"),
        @Index(name = "idx_behavior_product_id", columnList = "product_id"),
        @Index(name = "idx_behavior_type", columnList = "behavior_type"),
        @Index(name = "idx_behavior_session", columnList = "session_id"),
        @Index(name = "idx_behavior_created_at", columnList = "created_at")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserBehaviorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "session_id", length = 64)
    private String sessionId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "brand_id")
    private Long brandId;

    @Enumerated(EnumType.STRING)
    @Column(name = "behavior_type", length = 30, nullable = false)
    private BehaviorType behaviorType;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "extra_data", columnDefinition = "TEXT")
    private String extraData;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum BehaviorType {
        VIEW, CLICK, ADD_TO_CART, ADD_TO_WISHLIST, PURCHASE,
        SEARCH, FILTER, REVIEW, SHARE, COMPARE, AI_RECOMMEND_CLICK
    }
}
