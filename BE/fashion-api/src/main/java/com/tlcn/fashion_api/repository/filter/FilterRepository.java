package com.tlcn.fashion_api.repository.filter;

import java.util.List;

import com.tlcn.fashion_api.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FilterRepository extends JpaRepository<Product, Long> {

    // Min / max price từ product_variants
    @Query(value = """
        SELECT 
            MIN(pv.price) AS minPrice,
            MAX(pv.price) AS maxPrice
        FROM product_variants pv
        JOIN products p ON p.id = pv.product_id
        WHERE p.status = 'active'
        """, nativeQuery = true)
    List<Object[]> findMinMaxPrice();

    // Đếm in-stock / out-of-stock dựa trên stocks.quantity
    @Query(value = """
        SELECT
            SUM(CASE WHEN s.quantity > 0 THEN 1 ELSE 0 END) AS inStock,
            SUM(CASE WHEN s.quantity <= 0 THEN 1 ELSE 0 END) AS outStock
        FROM product_variants pv
        JOIN products p ON p.id = pv.product_id
        LEFT JOIN stocks s ON s.variant_id = pv.id
        WHERE p.status = 'active'
        """, nativeQuery = true)
    List<Object[]> countAvailability();  // <-- đổi sang List<Object[]>

    // Các query dưới giữ nguyên
    // Đếm sản phẩm của category root bao gồm cả con (tối đa 1 cấp con)
    @Query(value = """
        SELECT 
            c.id,
            c.name,
            c.slug,
            (
                SELECT COUNT(DISTINCT p2.id)
                FROM product_categories pc2
                JOIN products p2 ON p2.id = pc2.product_id AND p2.status = 'active'
                JOIN categories c2 ON c2.id = pc2.category_id
                WHERE c2.id = c.id OR c2.parent_id = c.id
            ) AS productCount
        FROM categories c
        WHERE c.parent_id IS NULL
        ORDER BY c.sort_order
        """, nativeQuery = true)
    List<Object[]> findCategoryFilters();

    @Query(value = """
        SELECT av.id, av.value AS colorName, COUNT(DISTINCT pv.id) AS variantCount
        FROM attribute_values av
        JOIN variant_attribute_values vav ON vav.attribute_value_id = av.id
        JOIN product_variants pv ON pv.id = vav.variant_id
        JOIN products p ON p.id = pv.product_id
        WHERE av.attribute_id = 1
          AND p.status = 'active'
        GROUP BY av.id, av.value, av.sort_order
        ORDER BY av.sort_order
        """, nativeQuery = true)
    List<Object[]> findColorFilters();

    @Query(value = """
    SELECT 
        av.attribute_id AS attrId,
        av.value AS sizeValue,
        COUNT(DISTINCT pv.id) AS variantCount
    FROM attribute_values av
    JOIN variant_attribute_values vav ON vav.attribute_value_id = av.id
    JOIN product_variants pv ON pv.id = vav.variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE av.attribute_id IN (2, 3)
      AND p.status = 'active'
    GROUP BY av.attribute_id, av.value, av.sort_order
    ORDER BY av.attribute_id, av.sort_order
""", nativeQuery = true)
    List<Object[]> findAllSizeFilters();

    @Query(value = """
        SELECT b.id, b.name, COUNT(DISTINCT p.id) AS productCount
        FROM brands b
        LEFT JOIN products p ON p.brand_id = b.id AND p.status = 'active'
        GROUP BY b.id, b.name
        ORDER BY b.name
        """, nativeQuery = true)
    List<Object[]> findBrandFilters();
}
