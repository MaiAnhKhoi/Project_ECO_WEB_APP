package com.tlcn.fashion_api.repository.banner;

import com.tlcn.fashion_api.entity.banner.Banner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByPositionAndActiveOrderByIdAsc(String position, Boolean active);

    // Lấy danh sách banner active theo vị trí (cho FE dùng)
    @Query("""
        SELECT b FROM Banner b
        WHERE b.active = true
          AND (:position IS NULL OR b.position = :position)
        ORDER BY b.createdAt DESC
    """)
    List<Banner> findActiveByPosition(@Param("position") String position);

    // Tìm kiếm banner cho admin
    @Query("""
        SELECT b FROM Banner b
        WHERE (:position IS NULL OR b.position = :position)
          AND (:active IS NULL OR b.active = :active)
          AND (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY b.createdAt DESC
    """)
    Page<Banner> searchAdmin(@Param("position") String position,
                             @Param("active") Boolean active,
                             @Param("keyword") String keyword,
                             Pageable pageable);
}