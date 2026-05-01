package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.UserBehaviorLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserBehaviorLogRepository extends JpaRepository<UserBehaviorLog, Long> {

    @Query("""
            SELECT b.productId, COUNT(b) as cnt
            FROM UserBehaviorLog b
            WHERE b.userId = :userId
            AND b.productId IS NOT NULL
            AND b.behaviorType IN ('VIEW', 'CLICK', 'ADD_TO_CART', 'PURCHASE')
            GROUP BY b.productId
            ORDER BY cnt DESC
            """)
    List<Object[]> findTopProductIdsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            SELECT b.categoryId, COUNT(b) as cnt
            FROM UserBehaviorLog b
            WHERE b.userId = :userId
            AND b.categoryId IS NOT NULL
            GROUP BY b.categoryId
            ORDER BY cnt DESC
            """)
    List<Object[]> findTopCategoryIdsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            SELECT b.productId, COUNT(b) as cnt
            FROM UserBehaviorLog b
            WHERE b.createdAt >= :since
            AND b.productId IS NOT NULL
            AND b.behaviorType IN ('VIEW', 'CLICK', 'ADD_TO_CART', 'PURCHASE')
            GROUP BY b.productId
            ORDER BY cnt DESC
            """)
    List<Object[]> findTrendingProductIds(@Param("since") LocalDateTime since, Pageable pageable);

    List<UserBehaviorLog> findByUserIdAndBehaviorTypeOrderByCreatedAtDesc(
            Long userId, UserBehaviorLog.BehaviorType behaviorType, Pageable pageable);
}
