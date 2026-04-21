package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.Brand;
import com.tlcn.fashion_api.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,JpaSpecificationExecutor<Product> {

    /* ---------------------------------------------
       COMMON ENTITY GRAPH (load đầy đủ dữ liệu)
    ---------------------------------------------- */
    String PRODUCT_GRAPH = """
        {
            images,
            variants,
            variants.images,
            variants.stocks,
            variants.attributeValues,
            variants.attributeValues.attribute,
            variants.attributeValues.attributeValue
        }
    """;

    /* ---------------------------------------------
       ⭐ Best Sellers
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    List<Product> findByStatusOrderBySoldCountDesc(String status, Pageable pageable);

    /* ---------------------------------------------
       ⭐ New Arrivals
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    List<Product> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    /* ---------------------------------------------
       ⭐ Most Popular
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    List<Product> findByStatusOrderByViewCountDesc(String status, Pageable pageable);

    /* ---------------------------------------------
       ⭐ Best Deals (dựa trên % giảm giá)
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    @Query("""
        SELECT p FROM Product p
        JOIN p.variants v
        WHERE p.status = :status
          AND v.compareAtPrice > v.price
        GROUP BY p.id
        ORDER BY MAX((v.compareAtPrice - v.price) / v.compareAtPrice) DESC
    """)
    List<Product> findBestDeals(String status, Pageable pageable);

    /* ---------------------------------------------
       ⭐ Featured Products (Sản phẩm nổi bật)
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    List<Product> findByStatusAndIsFeaturedOrderByCreatedAtDesc(String status, Boolean isFeatured, Pageable pageable);

    /* ---------------------------------------------
       ⭐ Today's Picks = trending / today-pick
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    @Query("""
        SELECT p FROM Product p
        WHERE p.status = :status
          AND (p.tags LIKE %:tag1% OR p.tags LIKE %:tag2%)
        ORDER BY p.createdAt DESC
    """)
    List<Product> findTodayPicks(String status, String tag1, String tag2, Pageable pageable);

    @Query(value = """
    SELECT p.* FROM products p
    JOIN product_categories pc ON pc.product_id = p.id
    JOIN categories c ON c.id = pc.category_id
    WHERE c.slug = :slug
      AND p.status = :status
    ORDER BY p.created_at DESC
    LIMIT :limit
""", nativeQuery = true)
    List<Product> findByCategorySlug(
            @Param("slug") String slug,
            @Param("status") String status,
            @Param("limit") int limit
    );
    Page<Product> findByStatus(String status, Pageable pageable);



    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue"
    })
    Optional<Product> findDetailByIdAndStatus(Long id, String status);

    @Query("""
        select p
        from Product p
        join WishlistItem wi on wi.product = p
        join Wishlist w on wi.wishlist = w
        where w.user.id = :userId
        """)
    Page<Product> findWishlistProductsByUserId(Long userId, Pageable pageable);



    @Query(value = """
        SELECT DISTINCT p.*,
            (
                CASE WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 10 ELSE 0 END +
                CASE WHEN LOWER(p.tags) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 5 ELSE 0 END +
                CASE WHEN LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 3 ELSE 0 END +
                CASE WHEN LOWER(p.meta_keywords) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 4 ELSE 0 END +
                CASE WHEN LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 7 ELSE 0 END +
                CASE WHEN LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 5 ELSE 0 END
            ) AS relevance_score
        FROM products p
        LEFT JOIN brands b ON b.id = p.brand_id
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        LEFT JOIN categories c ON c.id = pc.category_id
        WHERE p.status = :status
            AND (
                LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.meta_keywords) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
        ORDER BY relevance_score DESC, p.created_at DESC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT p.id)
        FROM products p
        LEFT JOIN brands b ON b.id = p.brand_id
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        LEFT JOIN categories c ON c.id = pc.category_id
        WHERE p.status = :status
            AND (
                LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.meta_keywords) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
        """,
            nativeQuery = true)
    Page<Product> searchProductsByKeyword(@Param("keyword") String keyword,
                                          @Param("status") String status,
                                          Pageable pageable);

    /* ---------------------------------------------
       ⭐ Get Product with Brand and Category info for search
    ---------------------------------------------- */
    @EntityGraph(attributePaths = {
            "images",
            "variants",
            "variants.images",
            "variants.stocks",
            "variants.attributeValues",
            "variants.attributeValues.attribute",
            "variants.attributeValues.attributeValue",
            "categories"
    })
    @Query("""
    SELECT DISTINCT p FROM Product p
    WHERE p.id IN :ids
    """)
    List<Product> findAllByIdInWithDetails(@Param("ids") List<Long> ids);



    /* ---------------------------------------------
       ⭐ Get Brand by Product ID
    ---------------------------------------------- */
    @Query("""
        SELECT b FROM Brand b
        WHERE b.id = :brandId
        """)
    Brand findBrandById(@Param("brandId") Long brandId);

    long countByStatus(String status);

    @Query("SELECT p FROM Product p ORDER BY p.soldCount DESC")
    List<Product> findTopProductsBySoldCount(Pageable pageable);

    @Modifying
    @Query("UPDATE Product p " +
            "SET p.soldCount = COALESCE(p.soldCount, 0) + :qty " +
            "WHERE p.id = :productId")
    void increaseSoldCount(Long productId, Integer qty);

    @Modifying
    @Query("UPDATE Product p " +
            "SET p.viewCount = COALESCE(p.viewCount, 0) + 1 " +
            "WHERE p.id = :productId")
    void increaseViewCount(Long productId);
}

