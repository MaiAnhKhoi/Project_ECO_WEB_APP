package com.tlcn.fashion_api.entity.ai;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_recommendation_logs", indexes = {
        @Index(name = "idx_rec_user_id", columnList = "user_id"),
        @Index(name = "idx_rec_type", columnList = "recommendation_type"),
        @Index(name = "idx_rec_created_at", columnList = "created_at"),
        @Index(name = "idx_rec_prompt_hash", columnList = "prompt_hash")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AiRecommendationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "session_id", length = 64)
    private String sessionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_type", length = 30, nullable = false)
    private RecommendationType recommendationType;

    @Column(name = "user_prompt", columnDefinition = "TEXT")
    private String userPrompt;

    @Column(name = "prompt_hash", length = 64)
    private String promptHash;

    @Column(name = "ai_response", columnDefinition = "LONGTEXT")
    private String aiResponse;

    @Column(name = "products_context_ids", length = 1024)
    private String productsContextIds;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @Column(name = "latency_ms")
    private Long latencyMs;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private LogStatus status = LogStatus.SUCCESS;

    @Column(name = "error_message", length = 512)
    private String errorMessage;

    @Column(name = "cache_hit")
    @Builder.Default
    private Boolean cacheHit = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum RecommendationType {
        OUTFIT, PRODUCTS, SIMILAR, TRENDING, PERSONALIZED
    }

    public enum LogStatus {
        SUCCESS, ERROR, CACHED, RATE_LIMITED
    }
}
