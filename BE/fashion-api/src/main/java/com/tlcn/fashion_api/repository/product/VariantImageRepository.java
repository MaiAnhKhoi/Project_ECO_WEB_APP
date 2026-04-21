package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.VariantImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VariantImageRepository extends JpaRepository<VariantImage, Long> {

    /**
     * Lấy tất cả ảnh của variant (entity path: variant.id)
     */
    List<VariantImage> findByVariant_IdOrderBySortOrderAsc(Long variantId);

    /**
     * Lấy tất cả ảnh của variant (field path: variantId)
     * → Một số service đang dùng kiểu này nên giữ luôn.
     */
    List<VariantImage> findByVariantIdOrderBySortOrderAsc(Long variantId);

    /**
     * Ảnh primary của 1 variant
     */
    Optional<VariantImage> findFirstByVariant_IdAndIsPrimaryTrueOrderBySortOrderAsc(Long variantId);

    /**
     * Ảnh đầu tiên theo sortOrder
     */
    Optional<VariantImage> findFirstByVariant_IdOrderBySortOrderAsc(Long variantId);

    /**
     * Ảnh đầu tiên (không quan tâm sort/primary)
     */
    Optional<VariantImage> findFirstByVariant_Id(Long variantId);

    /**
     * Xoá toàn bộ ảnh của variant
     */
    void deleteByVariant_Id(Long variantId);

    /**
     * Lấy max sortOrder
     */
    @Query("""
        select max(vi.sortOrder)
        from VariantImage vi
        where vi.variant.id = :variantId
    """)
    Optional<Integer> findMaxSortOrderByVariantId(@Param("variantId") Long variantId);
}
