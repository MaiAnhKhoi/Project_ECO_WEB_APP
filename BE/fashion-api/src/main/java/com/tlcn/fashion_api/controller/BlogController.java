package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.request.blog.BlogCommentRequest;
import com.tlcn.fashion_api.dto.request.blog.BlogRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogCommentResponse;
import com.tlcn.fashion_api.dto.response.blog.BlogResponse;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.blog.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@CrossOrigin
public class BlogController {

    private final BlogService blogService;

    // Public endpoints
    @GetMapping
    public ResponseEntity<Page<BlogResponse>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        // If no status provided, default to published for public access
        // Pass "all" to get all blogs regardless of status
        String blogStatus = status != null && !status.isBlank() ? status : "published";
        return ResponseEntity.ok(blogService.getAllBlogs(page, size, blogStatus));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogResponse> getBlogBySlug(@PathVariable String slug) {
        blogService.incrementViewCount(slug);
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogResponse>> searchBlogs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.searchBlogs(keyword, page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<BlogResponse>> getBlogsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getBlogsByCategory(category, page, size));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<BlogResponse>> getLatestBlogs(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(blogService.getLatestBlogs(limit));
    }

    @GetMapping("/top-viewed")
    public ResponseEntity<List<BlogResponse>> getTopViewedBlogs(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(blogService.getTopViewedBlogs(limit));
    }

    // Protected endpoints - require authentication
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.createBlog(request, userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<BlogResponse> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(blogService.updateBlog(id, request, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        blogService.deleteBlog(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Blog Comments
    @GetMapping("/{blogId}/comments")
    public ResponseEntity<Page<BlogCommentResponse>> getBlogComments(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getBlogComments(blogId, page, size));
    }

    @PostMapping("/{blogId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogCommentResponse> addComment(
            @PathVariable Long blogId,
            @Valid @RequestBody BlogCommentRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.addComment(blogId, request, userId));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        Long userId = SecurityUtils.getCurrentUserId();
        blogService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}

