package com.tlcn.fashion_api.repository.category;

import com.tlcn.fashion_api.entity.product.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // root categories: parent_id IS NULL
    List<Category> findByParentIsNullOrderBySortOrderAsc();

    // children by parent_id
    List<Category> findByParent_IdOrderBySortOrderAsc(Long parentId);

    Optional<Category> findBySlug(String slug);
}