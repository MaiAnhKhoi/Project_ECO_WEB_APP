package com.tlcn.fashion_api.mapper.category;

import com.tlcn.fashion_api.dto.request.category.CreateCategoryRequest;
import com.tlcn.fashion_api.dto.request.category.UpdateCategoryRequest;
import com.tlcn.fashion_api.dto.response.categorie.CategoryDto;
import com.tlcn.fashion_api.entity.product.Category;

public class CategoryMapper {

    public static CategoryDto toDto(Category entity) {
        if (entity == null) return null;

        Long parentId = entity.getParent() != null ? entity.getParent().getId() : null;

        return CategoryDto.builder()
                .id(entity.getId())
                .parentId(parentId)
                .name(entity.getName())
                .slug(entity.getSlug())
                .imageUrl(entity.getImageUrl())
                .sortOrder(entity.getSortOrder())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static Category toEntity(CreateCategoryRequest req, Category parent) {
        Category category = new Category();
        category.setName(req.getName());
        category.setSlug(req.getSlug());
        category.setDescription(req.getDescription());
        category.setImageUrl(req.getImageUrl());
        category.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 1);
        category.setParent(parent);
        return category;
    }

    public static void updateEntity(Category entity, UpdateCategoryRequest req, Category parent) {
        if (req.getName() != null) {
            entity.setName(req.getName());
        }
        if (req.getSlug() != null) {
            entity.setSlug(req.getSlug());
        }
        if (req.getDescription() != null) {
            entity.setDescription(req.getDescription());
        }
        if (req.getImageUrl() != null) {
            entity.setImageUrl(req.getImageUrl());
        }
        if (req.getSortOrder() != null) {
            entity.setSortOrder(req.getSortOrder());
        }
        if (req.getParentId() != null) {
            entity.setParent(parent);
        }
    }
}