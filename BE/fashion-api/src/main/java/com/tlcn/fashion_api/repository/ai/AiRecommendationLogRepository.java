package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.AiRecommendationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AiRecommendationLogRepository extends JpaRepository<AiRecommendationLog, Long> {

    Optional<AiRecommendationLog> findByPromptHashAndStatusAndCacheHitFalse(
            String promptHash, AiRecommendationLog.LogStatus status);

    Page<AiRecommendationLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("""
            SELECT r FROM AiRecommendationLog r
            WHERE r.userId = :userId
            AND r.recommendationType = :type
            ORDER BY r.createdAt DESC
            """)
    Page<AiRecommendationLog> findByUserIdAndType(
            @Param("userId") Long userId,
            @Param("type") AiRecommendationLog.RecommendationType type,
            Pageable pageable);
}
