package com.tlcn.fashion_api.repository.compare;

import com.tlcn.fashion_api.entity.compare.ComparisonItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComparisonItemRepository extends JpaRepository<ComparisonItem, Long> {

    Optional<ComparisonItem> findByComparisonIdAndProductId(Long comparisonId, Long productId);

    void deleteByComparisonIdAndProductId(Long comparisonId, Long productId);

    long countByComparisonId(Long comparisonId);
}