package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.StyleAnalysisHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StyleAnalysisHistoryRepository extends JpaRepository<StyleAnalysisHistory, Long> {

    Page<StyleAnalysisHistory> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
