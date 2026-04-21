package com.tlcn.fashion_api.service.blog;

import com.tlcn.fashion_api.dto.request.blog.BlogCategoryRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogCategoryResponse;
import com.tlcn.fashion_api.entity.blog.BlogCategory;
import com.tlcn.fashion_api.common.exception.BadRequestException;
import com.tlcn.fashion_api.common.exception.ResourceNotFoundException;
import com.tlcn.fashion_api.repository.blog.BlogCategoryRepository;
import com.tlcn.fashion_api.repository.blog.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogCategoryServiceImpl implements BlogCategoryService {

    private final BlogCategoryRepository categoryRepository;
    private final BlogRepository blogRepository;

    @Override
    public List<BlogCategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlogCategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BlogCategoryResponse getCategoryById(Long id) {
        BlogCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục blog"));
        return toResponse(category);
    }

    @Override
    public BlogCategoryResponse getCategoryBySlug(String slug) {
        BlogCategory category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục blog"));
        return toResponse(category);
    }

    @Override
    @Transactional
    public BlogCategoryResponse createCategory(BlogCategoryRequest request) {
        // Check duplicate name
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Tên danh mục đã tồn tại");
        }

        // Check duplicate slug
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug đã tồn tại");
        }

        BlogCategory category = BlogCategory.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Override
    @Transactional
    public BlogCategoryResponse updateCategory(Long id, BlogCategoryRequest request) {
        BlogCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục blog"));

        // Check duplicate name (exclude current category)
        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Tên danh mục đã tồn tại");
        }

        // Check duplicate slug (exclude current category)
        if (!category.getSlug().equals(request.getSlug()) &&
                categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug đã tồn tại");
        }

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }

        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        BlogCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục blog"));

        // Check if category has blogs
        long blogCount = blogRepository.countByCategory(category);
        if (blogCount > 0) {
            throw new BadRequestException(
                    "Không thể xóa danh mục này vì còn " + blogCount + " blog đang sử dụng");
        }

        categoryRepository.delete(category);
    }

    private BlogCategoryResponse toResponse(BlogCategory category) {
        long blogCount = blogRepository.countByCategory(category);

        return BlogCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .sortOrder(category.getSortOrder())
                .isActive(category.getIsActive())
                .blogCount(blogCount)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}