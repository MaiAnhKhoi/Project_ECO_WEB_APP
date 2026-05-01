package com.tlcn.fashion_api.service.ai;

import com.tlcn.fashion_api.entity.ai.UserBehaviorLog;
import com.tlcn.fashion_api.repository.ai.UserBehaviorLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserBehaviorService {

    private final UserBehaviorLogRepository behaviorLogRepository;

    @Async
    public void logBehavior(Long userId, String sessionId, Long productId,
                            Long categoryId, Long brandId,
                            UserBehaviorLog.BehaviorType behaviorType) {
        try {
            behaviorLogRepository.save(UserBehaviorLog.builder()
                    .userId(userId)
                    .sessionId(sessionId)
                    .productId(productId)
                    .categoryId(categoryId)
                    .brandId(brandId)
                    .behaviorType(behaviorType)
                    .build());
        } catch (Exception e) {
            log.warn("Failed to save behavior log: {}", e.getMessage());
        }
    }
}
