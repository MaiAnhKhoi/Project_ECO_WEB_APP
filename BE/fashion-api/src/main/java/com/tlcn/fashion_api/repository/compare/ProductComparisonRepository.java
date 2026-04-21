package com.tlcn.fashion_api.repository.compare;

import com.tlcn.fashion_api.entity.compare.ProductComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductComparisonRepository extends JpaRepository<ProductComparison, Long> {

    @EntityGraph(attributePaths = {"items", "items.product", "items.product.images"})
    Optional<ProductComparison> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}