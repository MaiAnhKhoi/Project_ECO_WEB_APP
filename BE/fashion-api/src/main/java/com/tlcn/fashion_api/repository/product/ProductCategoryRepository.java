package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, ProductCategoryId> {

    // Lấy tất cả category của 1 product
    List<ProductCategory> findById_ProductId(Long productId);

    // Lấy tất cả product thuộc 1 category
    List<ProductCategory> findById_CategoryId(Long categoryId);
}