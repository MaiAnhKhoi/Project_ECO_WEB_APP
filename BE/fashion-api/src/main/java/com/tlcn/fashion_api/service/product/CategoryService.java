package com.tlcn.fashion_api.service.product;

import com.tlcn.fashion_api.dto.request.category.CreateCategoryRequest;
import com.tlcn.fashion_api.dto.request.category.UpdateCategoryRequest;
import com.tlcn.fashion_api.dto.response.categorie.CategoryDto;
import com.tlcn.fashion_api.entity.product.Category;
import com.tlcn.fashion_api.mapper.category.CategoryMapper;
import com.tlcn.fashion_api.repository.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIsNullOrderBySortOrderAsc();
    }

    public List<Category> getChildren(Long parentId) {
        return categoryRepository.findByParent_IdOrderBySortOrderAsc(parentId);
    }

    public List<Category> getChildrenByParentSlug(String slug) {
        var parent = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return getChildren(parent.getId());
    }

    public Page<CategoryDto> getAllCategoriesAdmin(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(CategoryMapper::toDto);
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return CategoryMapper.toDto(category);
    }

    public CategoryDto createCategory(CreateCategoryRequest req) {
        Category parent = null;
        if (req.getParentId() != null) {
            parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
        }

        // auto slug nếu chưa có
        if (req.getSlug() == null || req.getSlug().isBlank()) {
            req.setSlug(slugify(req.getName()));
        }

        Category category = CategoryMapper.toEntity(req, parent);
        categoryRepository.save(category);
        return CategoryMapper.toDto(category);
    }

    public CategoryDto updateCategory(Long id, UpdateCategoryRequest req) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Category parent = null;
        if (req.getParentId() != null) {
            parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
        }

        // auto slug nếu có name mới mà không truyền slug
        if (req.getSlug() == null && req.getName() != null) {
            req.setSlug(slugify(req.getName()));
        }

        CategoryMapper.updateEntity(category, req, parent);
        categoryRepository.save(category);
        return CategoryMapper.toDto(category);
    }

    public void deleteCategory(Long id) {
        // tùy bạn có muốn check đang được product dùng không
        categoryRepository.deleteById(id);
    }

    // Helper đơn giản, bạn có thể thay bằng lib slugify
    private String slugify(String input) {
        return input.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}