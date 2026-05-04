package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.entity.ai.StyleAnalysisHistory;
import com.tlcn.fashion_api.repository.ai.StyleAnalysisHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Lưu lịch sử phân tích phong cách bất đồng bộ — không chặn response API.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StyleAnalysisHistoryWriter {

    private final StyleAnalysisHistoryRepository historyRepository;

    @Async("asyncExecutor")
    public void saveAsync(Long userId, String imageUrl, String bodyType, String skinTone,
                          String recommendedStyle, String resultJson) {
        if (userId == null) return;
        try {
            historyRepository.save(StyleAnalysisHistory.builder()
                    .userId(userId)
                    .imageUrl(imageUrl)
                    .bodyType(bodyType)
                    .skinTone(skinTone)
                    .recommendedStyle(recommendedStyle)
                    .resultJson(resultJson)
                    .build());
        } catch (Exception e) {
            log.warn("[StyleAnalysis] Async history save failed: {}", e.getMessage());
        }
    }
}
