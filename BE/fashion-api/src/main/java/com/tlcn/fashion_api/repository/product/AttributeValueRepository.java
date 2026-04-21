package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Long> {

    /**
     * Lấy tất cả value theo 1 attribute (vd: tất cả màu của Color)
     */
    List<AttributeValue> findByAttribute_IdOrderBySortOrderAsc(Long attributeId);

    /**
     * (optional) tìm theo attribute + value (dùng khi tránh trùng)
     */
    boolean existsByAttribute_IdAndValueIgnoreCase(Long attributeId, String value);

    List<AttributeValue> findByAttributeIdOrderByValueAsc(Long attributeId);
}
