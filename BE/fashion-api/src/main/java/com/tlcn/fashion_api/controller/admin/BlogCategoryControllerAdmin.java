package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.dto.request.blog.BlogCategoryRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogCategoryResponse;
import com.tlcn.fashion_api.service.blog.BlogCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("adminBlogCategoryController")
@RequestMapping("/api/admin/blog-categories")
@RequiredArgsConstructor
@Tag(name = "Blog Category Management", description = "Blog category management APIs (Admin & Editor)")
public class BlogCategoryControllerAdmin {

    private final BlogCategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "List blog categories (Admin)")
    public ResponseEntity<ApiResponse<List<BlogCategoryResponse>>> listBlogCategoriesAdmin() {
        List<BlogCategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Get blog category detail (Admin)")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> getBlogCategoryDetailAdmin(
            @PathVariable Long id
    ) {
        BlogCategoryResponse dto = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Create blog category (Admin)")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> createBlogCategory(
            @Valid @RequestBody BlogCategoryRequest request
    ) {
        BlogCategoryResponse dto = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Blog category created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Update blog category (Admin)")
    public ResponseEntity<ApiResponse<BlogCategoryResponse>> updateBlogCategory(
            @PathVariable Long id,
            @Valid @RequestBody BlogCategoryRequest request
    ) {
        BlogCategoryResponse dto = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Blog category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Delete blog category (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteBlogCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Blog category deleted successfully"));
    }
}

