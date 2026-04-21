package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.blog.BlogRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogResponse;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.blog.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController("adminBlogController")
@RequestMapping("/api/admin/blog-posts")
@RequiredArgsConstructor
@Tag(name = "Blog Management", description = "Blog management APIs (Admin & Editor)")
public class BlogControllerAdmin {

    private final BlogService blogService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "List blog posts (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<BlogResponse>>> listBlogsAdmin(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BlogResponse> pageData = blogService.listBlogsAdmin(
                keyword, status, categoryId, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(pageData)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Get blog post detail (Admin)")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogDetailAdmin(
            @PathVariable Long id
    ) {
        BlogResponse dto = blogService.getBlogById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Create blog post (Admin)")
    public ResponseEntity<ApiResponse<BlogResponse>> createBlog(
            @Valid @RequestPart("data") BlogRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        // Upload image to Cloudinary if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "blogs");
            request.setFeaturedImage(imageUrl);
        }

        Long userId = SecurityUtils.getCurrentUserId();
        BlogResponse dto = blogService.createBlog(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Blog post created successfully"));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Update blog post (Admin)")
    public ResponseEntity<ApiResponse<BlogResponse>> updateBlog(
            @PathVariable Long id,
            @Valid @RequestPart("data") BlogRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        // Upload image to Cloudinary if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "blogs");
            request.setFeaturedImage(imageUrl);
        }

        Long userId = SecurityUtils.getCurrentUserId();
        BlogResponse dto = blogService.updateBlog(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success(dto, "Blog post updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Delete blog post (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        blogService.deleteBlog(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Blog post deleted successfully"));
    }
}

