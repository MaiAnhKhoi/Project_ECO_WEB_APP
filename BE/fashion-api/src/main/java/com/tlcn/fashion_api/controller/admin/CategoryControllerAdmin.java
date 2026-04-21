package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.category.CreateCategoryRequest;
import com.tlcn.fashion_api.dto.request.category.UpdateCategoryRequest;
import com.tlcn.fashion_api.dto.response.categorie.CategoryDto;
import com.tlcn.fashion_api.service.product.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController("adminCategoryController")
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Category management APIs (Admin & Product Manager)")
public class CategoryControllerAdmin {

    private final CategoryService categoryService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Get all categories with pagination")
    public ResponseEntity<ApiResponse<PageResponse<CategoryDto>>> getAllCategoriesAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryDto> categories = categoryService.getAllCategoriesAdmin(pageable);
        PageResponse<CategoryDto> response = PageResponse.of(categories);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Get category by ID (Admin)")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create category (Admin)")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @Valid @RequestPart("data") CreateCategoryRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "categories");
            request.setImageUrl(imageUrl);
        }

        CategoryDto category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(category, "Category created successfully"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update category (Admin)")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestPart("data") UpdateCategoryRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "categories");
            request.setImageUrl(imageUrl);
        }

        CategoryDto category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success(category, "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete category (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}
