package com.tlcn.fashion_api.repository.product;


import com.tlcn.fashion_api.entity.product.VariantAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttributeValue, Long> {

    @Query(value = """
        SELECT a.name AS attributeName,
               GROUP_CONCAT(DISTINCT av.value ORDER BY av.value SEPARATOR ', ') AS attributeValues
        FROM product_variants v
        JOIN variant_attribute_values vav ON v.id = vav.variant_id
        JOIN attributes a ON vav.attribute_id = a.id
        JOIN attribute_values av ON vav.attribute_value_id = av.id
        WHERE v.product_id = :productId
          AND a.name IN ('Color', 'Size')
        GROUP BY a.name
        """, nativeQuery = true)
    List<VariantAttributeProjection> findColorAndSizeByProductId(@Param("productId") Long productId);
}
