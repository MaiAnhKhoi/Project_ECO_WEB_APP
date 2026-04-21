package com.tlcn.fashion_api.repository.review;

import com.tlcn.fashion_api.entity.review.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {

    @Query("""
        select distinct r
        from Review r
        join fetch r.user u
        join fetch r.product p
        left join fetch r.reviewMedias rm
        left join fetch rm.media m
        where r.rating = 5
          and r.status = 'approved'
        order by r.createdAt desc
    """)
    List<Review> findAllFiveStarApprovedWithRelations();

    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, String status);

    /**
     * Kiểm tra user đã review sản phẩm này chưa
     */
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    /**
     * Đếm số lần user đã review sản phẩm này
     */
    long countByUserIdAndProductId(Long userId, Long productId);

    /**
     * Lấy danh sách review của sản phẩm với đầy đủ thông tin
     */
    @Query("""
        select distinct r
        from Review r
        join fetch r.user u
        left join fetch r.reviewMedias rm
        left join fetch rm.media m
        where r.product.id = :productId
          and r.status = 'approved'
        order by r.createdAt desc
    """)
    List<Review> findByProductIdWithRelations(@Param("productId") Long productId);

    /**
     * Lấy danh sách review của user với đầy đủ thông tin
     */
    @Query("""
        select distinct r
        from Review r
        join fetch r.user u
        join fetch r.product p
        left join fetch r.reviewMedias rm
        left join fetch rm.media m
        where r.user.id = :userId
        order by r.createdAt desc
    """)
    List<Review> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Lấy review detail với đầy đủ thông tin (user, product, medias)
     */
    @Query("""
        select distinct r
        from Review r
        join fetch r.user u
        join fetch r.product p
        left join fetch r.reviewMedias rm
        left join fetch rm.media m
        where r.id = :id
    """)
    Optional<Review> findByIdWithRelations(@Param("id") Long id);

    @Override
    @EntityGraph(attributePaths = {"product", "user", "reviewMedias", "reviewMedias.media"})
    org.springframework.data.domain.Page<Review> findAll(
            org.springframework.data.jpa.domain.Specification<Review> spec,
            org.springframework.data.domain.Pageable pageable
    );
}