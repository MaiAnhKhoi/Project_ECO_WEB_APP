package com.tlcn.fashion_api.dto.response.ai;

import com.tlcn.fashion_api.entity.ai.AiRecommendationLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecommendationHistoryDto {

    private Long id;
    private String type;
    private String userPrompt;
    private Integer tokensUsed;
    private Boolean cacheHit;
    private LocalDateTime createdAt;

    public static RecommendationHistoryDto from(AiRecommendationLog log) {
        return RecommendationHistoryDto.builder()
                .id(log.getId())
                .type(log.getRecommendationType() != null ? log.getRecommendationType().name() : null)
                .userPrompt(log.getUserPrompt())
                .tokensUsed(log.getTokensUsed())
                .cacheHit(log.getCacheHit())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
