package com.tlcn.fashion_api.dto.response.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.entity.ai.StyleAnalysisHistory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StyleAnalysisHistoryDto {

    private Long id;
    /** Ảnh gốc đã phân tích (Cloudinary / URL đầy đủ). */
    private String imageUrl;
    private String bodyType;
    private String skinTone;
    private String recommendedStyle;
    private String gender;
    /** 0.0–1.0 từ kết quả AI, lưu trong result_json. */
    private Double confidenceScore;
    private Boolean needsGenderConfirmation;
    private LocalDateTime createdAt;
    private List<ProductSuggestionDto> products;

    private static String coalesceText(String primary, String secondary) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }
        if (secondary != null && !secondary.isBlank()) {
            return secondary;
        }
        return primary;
    }

    public static StyleAnalysisHistoryDto from(StyleAnalysisHistory h, ObjectMapper om) {
        var builder = StyleAnalysisHistoryDto.builder()
                .id(h.getId())
                .imageUrl(h.getImageUrl())
                .bodyType(h.getBodyType())
                .skinTone(h.getSkinTone())
                .recommendedStyle(h.getRecommendedStyle())
                .createdAt(h.getCreatedAt())
                .confidenceScore(null)
                .needsGenderConfirmation(Boolean.FALSE)
                .products(List.of());

        if (h.getResultJson() == null || h.getResultJson().isBlank()) {
            return builder.build();
        }
        try {
            StyleAnalysisResponse parsed = om.readValue(h.getResultJson(), StyleAnalysisResponse.class);
            String img = coalesceText(h.getImageUrl(), parsed.getAnalyzedImageUrl());
            return builder
                    .imageUrl(img)
                    .bodyType(coalesceText(h.getBodyType(), parsed.getBodyType()))
                    .skinTone(coalesceText(h.getSkinTone(), parsed.getSkinTone()))
                    .recommendedStyle(coalesceText(h.getRecommendedStyle(), parsed.getRecommendedStyle()))
                    .gender(parsed.getGender())
                    .confidenceScore(parsed.getConfidenceScore())
                    .needsGenderConfirmation(Boolean.valueOf(parsed.isNeedsGenderConfirmation()))
                    .products(parsed.getProducts() != null ? parsed.getProducts() : List.of())
                    .build();
        } catch (Exception e) {
            return builder.build();
        }
    }
}
