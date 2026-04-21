package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    // Ảnh của 1 variant (ưu tiên sort_order nhỏ nhất)
    Optional<ProductImage> findFirstByVariantIdOrderBySortOrderAsc(Long variantId);

    // Ảnh default của product (nếu variant không có ảnh riêng)
    Optional<ProductImage> findFirstByProductIdAndIsPrimaryTrueOrderBySortOrderAsc(Long productId);

    @Query("""
        select pi from ProductImage pi
        where pi.product.id = :productId
        order by pi.isPrimary desc, pi.sortOrder asc
    """)
    Optional<ProductImage> findMainImageByProductId(Long productId);

    // Tất cả ảnh của product
    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);

    // Tất cả ảnh của 1 variant (nếu bạn cần)
    List<ProductImage> findByVariantIdOrderBySortOrderAsc(Long variantId);

    // ảnh cho variant
    Optional<ProductImage> findFirstByProductIdAndVariantIdAndIsPrimaryTrue(Long productId, Long variantId);
    Optional<ProductImage> findFirstByProductIdAndVariantId(Long productId, Long variantId);

    // ảnh cho product
    Optional<ProductImage> findFirstByProductIdAndIsPrimaryTrue(Long productId);
    Optional<ProductImage> findFirstByProductId(Long productId);

    // 🔥 Hàm mới: lấy max sortOrder của ảnh 1 product (dùng khi thêm ảnh mới)
    @Query("""
        select max(pi.sortOrder)
        from ProductImage pi
        where pi.product.id = :productId
    """)
    Optional<Integer> findMaxSortOrderByProductId(Long productId);
}
