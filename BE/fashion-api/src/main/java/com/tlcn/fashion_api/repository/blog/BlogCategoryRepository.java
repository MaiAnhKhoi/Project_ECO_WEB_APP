package com.tlcn.fashion_api.repository.blog;

import com.tlcn.fashion_api.entity.blog.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {

    Optional<BlogCategory> findBySlug(String slug);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    List<BlogCategory> findByIsActiveTrueOrderBySortOrderAsc();

    List<BlogCategory> findAllByOrderBySortOrderAsc();
}