package com.tlcn.fashion_api.repository.stock;

import com.tlcn.fashion_api.entity.product.Stock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    /**
     * Số lượng có thể bán = quantity - safetyStock (>= 0)
     */
    @Query("""
        select coalesce(s.quantity - s.safetyStock, 0)
        from Stock s
        where s.variant.id = :variantId
    """)
    Integer getSellableQuantityByVariantId(@Param("variantId") Long variantId);

    /**
     * Tìm stock theo variantId (không lock)
     */
    Optional<Stock> findByVariantId(Long variantId);

    /**
     * Tìm stock đầu tiên theo variantId (dùng trong service admin)
     */
    Optional<Stock> findFirstByVariantId(Long variantId);

    /**
     * Tìm stock và lock PESSIMISTIC_WRITE (dùng trong luồng trừ tồn kho khi checkout)
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Stock s where s.variant.id = :variantId")
    Optional<Stock> findByVariantIdForUpdate(@Param("variantId") Long variantId);

    /**
     * Xoá stock theo variant (khi xoá variant)
     */
    void deleteByVariantId(Long variantId);
}
