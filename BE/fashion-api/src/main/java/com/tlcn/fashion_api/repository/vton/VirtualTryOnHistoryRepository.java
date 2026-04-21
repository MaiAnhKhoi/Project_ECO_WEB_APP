package com.tlcn.fashion_api.repository.vton;

import com.tlcn.fashion_api.entity.vton.VirtualTryOnHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VirtualTryOnHistoryRepository extends JpaRepository<VirtualTryOnHistory, Long> {

    List<VirtualTryOnHistory> findTop10ByUserIdAndProductIdOrderByCreatedAtDesc(Long userId, Long productId);
}


