package com.tlcn.fashion_api.repository.blog;

import com.tlcn.fashion_api.entity.blog.Blog;
import com.tlcn.fashion_api.entity.blog.BlogCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    @EntityGraph(attributePaths = {"author", "category"})
    Optional<Blog> findBySlug(String slug);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Blog> findByStatus(String status, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    @Query("SELECT b FROM Blog b")
    Page<Blog> findAllWithAuthorAndCategory(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.status = :status AND " +
            "(b.title LIKE %:keyword% OR b.content LIKE %:keyword% OR b.tags LIKE %:keyword%)")
    Page<Blog> searchByKeyword(@Param("status") String status,
                               @Param("keyword") String keyword,
                               Pageable pageable);

    Page<Blog> findByStatusAndCategory(String status, BlogCategory category, Pageable pageable);

    long countByCategory(BlogCategory category);

    @Query("SELECT b FROM Blog b WHERE b.status = 'published' ORDER BY b.viewCount DESC")
    List<Blog> findTopViewedBlogs(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.status = 'published' ORDER BY b.publishedAt DESC")
    List<Blog> findLatestBlogs(Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    @Query("SELECT b FROM Blog b WHERE " +
            "(:keyword IS NULL OR " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:categoryId IS NULL OR b.category.id = :categoryId)")
    Page<Blog> findBlogsAdmin(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );
}