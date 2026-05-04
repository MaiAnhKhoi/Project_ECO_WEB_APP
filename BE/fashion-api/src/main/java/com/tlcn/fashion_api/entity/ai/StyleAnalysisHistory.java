package com.tlcn.fashion_api.entity.ai;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "style_analysis_history", indexes = {
        @Index(name = "idx_style_hist_user", columnList = "user_id"),
        @Index(name = "idx_style_hist_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StyleAnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "body_type", length = 50)
    private String bodyType;

    @Column(name = "skin_tone", length = 50)
    private String skinTone;

    @Column(name = "recommended_style", length = 100)
    private String recommendedStyle;

    /** JSON đầy đủ kết quả (gender, confidence, products, v.v.) — để FE history hiển thị lại. */
    @Column(name = "result_json", columnDefinition = "LONGTEXT")
    private String resultJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
