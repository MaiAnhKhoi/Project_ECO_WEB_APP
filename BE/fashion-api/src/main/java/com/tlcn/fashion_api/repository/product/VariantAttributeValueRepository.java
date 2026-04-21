package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.VariantAttributeValue;
import com.tlcn.fashion_api.entity.product.VariantAttributeValueId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariantAttributeValueRepository
        extends JpaRepository<VariantAttributeValue, VariantAttributeValueId> {

    /**
     * Lấy tất cả attribute-value của 1 variant
     */
    List<VariantAttributeValue> findByVariantId(Long variantId);

    /**
     * Xoá toàn bộ attribute-values của 1 variant
     */
    void deleteByVariantId(Long variantId);

    /**
     * Tìm attribute value theo variant
     */
    List<VariantAttributeValue> findByVariantIdOrderByAttributeIdAsc(Long variantId);

    /**
     * Kiểm tra xem variant đã có attribute-value đó chưa
     * (dùng khi tránh duplicate)
     */
    boolean existsByVariantIdAndAttributeIdAndAttributeValueId(
            Long variantId,
            Long attributeId,
            Long attributeValueId
    );
}
