package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // Lấy toàn bộ variant + attribute để hiển thị list (dropdown color/size, v.v.)
    @Query("""
        select distinct v from ProductVariant v
        left join fetch v.attributeValues vav
        left join fetch vav.attribute a
        left join fetch vav.attributeValue av
        where v.product.id = :productId
    """)
    List<ProductVariant> findByProductIdWithAttributes(@Param("productId") Long productId);

    // Dùng cho CartService: tìm đúng 1 variant theo product + color + size
    @Query("""
        select v from ProductVariant v
            join v.product p
            join v.attributeValues vavColor
            join vavColor.attribute attrColor
            join vavColor.attributeValue valColor
            join v.attributeValues vavSize
            join vavSize.attribute attrSize
            join vavSize.attributeValue valSize
        where p.id = :productId
          and attrColor.name = 'Color'
          and valColor.value = :color
          and attrSize.name = 'Size'
          and valSize.value = :size
    """)
    Optional<ProductVariant> findByProductAndColorAndSize(
            @Param("productId") Long productId,
            @Param("color") String color,
            @Param("size") String size
    );

    // Lấy variant theo product + status (dùng cho FE, filter active / inactive)
    List<ProductVariant> findByProductIdAndStatus(Long productId, String status);

    // Thêm: lấy tất cả variant theo product (không fetch attribute)
    List<ProductVariant> findByProductId(Long productId);

    // Thêm: variant default (nếu bạn dùng isDefault trong entity)
    Optional<ProductVariant> findFirstByProductIdAndIsDefaultTrue(Long productId);
}
