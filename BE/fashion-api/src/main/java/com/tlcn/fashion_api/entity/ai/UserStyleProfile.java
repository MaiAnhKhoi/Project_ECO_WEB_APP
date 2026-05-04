package com.tlcn.fashion_api.entity.ai;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_style_profiles", indexes = {
        @Index(name = "idx_usp_user_id",    columnList = "user_id"),
        @Index(name = "idx_usp_created_at", columnList = "created_at")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserStyleProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    /** MALE | FEMALE | UNISEX | UNKNOWN */
    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "body_type", length = 50)
    private String bodyType;

    @Column(name = "skin_tone", length = 50)
    private String skinTone;

    @Column(name = "preferred_style", length = 100)
    private String preferredStyle;

    @Column(name = "analyzed_image_url", length = 1000)
    private String analyzedImageUrl;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "ai_raw_response", columnDefinition = "TEXT")
    private String aiRawResponse;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
