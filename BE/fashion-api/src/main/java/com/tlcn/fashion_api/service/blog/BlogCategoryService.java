package com.tlcn.fashion_api.service.blog;

import com.tlcn.fashion_api.dto.request.blog.BlogCategoryRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogCategoryResponse;

import java.util.List;

public interface BlogCategoryService {

    List<BlogCategoryResponse> getAllCategories();

    List<BlogCategoryResponse> getActiveCategories();

    BlogCategoryResponse getCategoryById(Long id);

    BlogCategoryResponse getCategoryBySlug(String slug);

    BlogCategoryResponse createCategory(BlogCategoryRequest request);

    BlogCategoryResponse updateCategory(Long id, BlogCategoryRequest request);

    void deleteCategory(Long id);
}