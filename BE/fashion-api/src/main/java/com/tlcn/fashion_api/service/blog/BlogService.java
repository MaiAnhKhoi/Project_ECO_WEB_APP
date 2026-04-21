package com.tlcn.fashion_api.service.blog;

import com.tlcn.fashion_api.dto.request.blog.BlogCommentRequest;
import com.tlcn.fashion_api.dto.request.blog.BlogRequest;
import com.tlcn.fashion_api.dto.response.blog.BlogCategoryResponse;
import com.tlcn.fashion_api.dto.response.blog.BlogCommentResponse;
import com.tlcn.fashion_api.dto.response.blog.BlogResponse;
import com.tlcn.fashion_api.entity.blog.Blog;
import com.tlcn.fashion_api.entity.blog.BlogCategory;
import com.tlcn.fashion_api.entity.blog.BlogComment;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.blog.BlogCategoryRepository;
import com.tlcn.fashion_api.repository.blog.BlogCommentRepository;
import com.tlcn.fashion_api.repository.blog.BlogRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final BlogCommentRepository blogCommentRepository;
    private final BlogCategoryRepository blogCategoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<BlogResponse> getAllBlogs(int page, int size, String status) {
        try {
            // Sort by publishedAt descending, then by createdAt descending
            // Note: nullsLast() is not supported with @EntityGraph, so we sort without it
            Sort sort = Sort.by(
                    Sort.Order.desc("publishedAt"),
                    Sort.Order.desc("createdAt")
            );
            Pageable pageable = PageRequest.of(page, size, sort);

            // If status is "all" or empty/null, get all blogs; otherwise filter by status
            Page<Blog> blogs;
            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("all")) {
                blogs = blogRepository.findByStatus(status, pageable);
            } else {
                // Use custom query to load author and category
                blogs = blogRepository.findAllWithAuthorAndCategory(pageable);
            }

            return blogs.map(this::mapToResponse);
        } catch (Exception e) {
            System.err.println("Error in getAllBlogs: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching blogs: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog not found with slug: " + slug));
        return mapToResponse(blog);
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        return mapToResponse(blog);
    }

    @Transactional
    public BlogResponse createBlog(BlogRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + authorId));

        // Fetch category if provided
        BlogCategory category = null;
        if (request.getCategoryId() != null) {
            category = blogCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        }

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .featuredImage(request.getFeaturedImage())
                .author(author)
                .category(category)
                .tags(request.getTags())
                .status(request.getStatus() != null ? request.getStatus() : "draft")
                .viewCount(0)
                .build();

        if ("published".equals(blog.getStatus())) {
            blog.setPublishedAt(LocalDateTime.now());
        }

        Blog savedBlog = blogRepository.save(blog);
        return mapToResponse(savedBlog);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request, Long userId) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));

        // Note: Permission check is handled by @PreAuthorize in controller
        // Admin and Editor roles are already verified at controller level
        // For additional security, you can check if user is author or has ADMIN role here
        // For now, we allow update since controller already restricts to ADMIN/EDITOR

        blog.setTitle(request.getTitle());
        blog.setSlug(request.getSlug());
        blog.setContent(request.getContent());
        blog.setExcerpt(request.getExcerpt());
        blog.setFeaturedImage(request.getFeaturedImage());

        // Update category if provided
        if (request.getCategoryId() != null) {
            BlogCategory category = blogCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            blog.setCategory(category);
        }

        blog.setTags(request.getTags());

        if (request.getStatus() != null) {
            String oldStatus = blog.getStatus();
            blog.setStatus(request.getStatus());

            // Set published date when status changes to published
            if ("published".equals(request.getStatus()) && !"published".equals(oldStatus)) {
                blog.setPublishedAt(LocalDateTime.now());
            }
        }

        Blog updatedBlog = blogRepository.save(blog);
        return mapToResponse(updatedBlog);
    }

    @Transactional
    public void deleteBlog(Long id, Long userId) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));

        // Note: Permission check is handled by @PreAuthorize in controller
        // Admin and Editor roles are already verified at controller level
        // For additional security, you can check if user is author or has ADMIN role here
        // For now, we allow delete since controller already restricts to ADMIN/EDITOR

        blogRepository.delete(blog);
    }

    @Transactional
    public void incrementViewCount(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog not found with slug: " + slug));
        blog.setViewCount(blog.getViewCount() + 1);
        blogRepository.save(blog);
    }

    @Transactional(readOnly = true)
    public Page<BlogResponse> searchBlogs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<Blog> blogs = blogRepository.searchByKeyword("published", keyword, pageable);
        return blogs.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<BlogResponse> getBlogsByCategory(String categorySlug, int page, int size) {
        BlogCategory category = blogCategoryRepository.findBySlug(categorySlug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + categorySlug));

        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<Blog> blogs = blogRepository.findByStatusAndCategory("published", category, pageable);
        return blogs.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getLatestBlogs(int limit) {
        List<Blog> blogs = blogRepository.findLatestBlogs(PageRequest.of(0, limit));
        return blogs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getTopViewedBlogs(int limit) {
        List<Blog> blogs = blogRepository.findTopViewedBlogs(PageRequest.of(0, limit));
        return blogs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Admin methods
    @Transactional(readOnly = true)
    public Page<BlogResponse> listBlogsAdmin(
            String keyword,
            String status,
            Long categoryId,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Order.desc("createdAt"));
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Normalize parameters - convert empty strings to null
        String normalizedKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String normalizedStatus = (status != null && !status.trim().isEmpty()) ? status.trim() : null;
        
        Page<Blog> blogs = blogRepository.findBlogsAdmin(normalizedKeyword, normalizedStatus, categoryId, pageable);
        return blogs.map(this::mapToResponse);
    }

    // Blog Comments
    @Transactional(readOnly = true)
    public Page<BlogCommentResponse> getBlogComments(Long blogId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogComment> comments = blogCommentRepository.findByBlogIdOrderByCreatedAtDesc(blogId, pageable);
        return comments.map(this::mapCommentToResponse);
    }

    @Transactional
    public BlogCommentResponse addComment(Long blogId, BlogCommentRequest request, Long userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        BlogComment comment = BlogComment.builder()
                .blog(blog)
                .user(user)
                .content(request.getContent())
                .build();

        BlogComment savedComment = blogCommentRepository.save(comment);
        return mapCommentToResponse(savedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        // Check if user is the comment author or admin
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }

        blogCommentRepository.delete(comment);
    }

    // Mapping methods
    private BlogResponse mapToResponse(Blog blog) {
        try {
            if (blog == null) {
                throw new RuntimeException("Blog is null");
            }
            long commentCount = blogCommentRepository.countByBlogId(blog.getId());

            // Map author - check null
            BlogResponse.AuthorInfo authorInfo = null;
            if (blog.getAuthor() != null) {
                authorInfo = BlogResponse.AuthorInfo.builder()
                        .id(blog.getAuthor().getId())
                        .name(blog.getAuthor().getName() != null ? blog.getAuthor().getName() : "Unknown")
                        .avatar(blog.getAuthor().getAvatarUrl())
                        .build();
            }

            // Map category
            BlogCategoryResponse categoryResponse = null;
            if (blog.getCategory() != null) {
                categoryResponse = BlogCategoryResponse.builder()
                        .id(blog.getCategory().getId())
                        .name(blog.getCategory().getName())
                        .slug(blog.getCategory().getSlug())
                        .description(blog.getCategory().getDescription())
                        .imageUrl(blog.getCategory().getImageUrl())
                        .sortOrder(blog.getCategory().getSortOrder())
                        .isActive(blog.getCategory().getIsActive())
                        .build();
            }

            return BlogResponse.builder()
                    .id(blog.getId())
                    .title(blog.getTitle() != null ? blog.getTitle() : "")
                    .slug(blog.getSlug() != null ? blog.getSlug() : "")
                    .content(blog.getContent())
                    .excerpt(blog.getExcerpt())
                    .featuredImage(blog.getFeaturedImage())
                    .author(authorInfo)
                    .category(categoryResponse)
                    .tags(blog.getTags())
                    .status(blog.getStatus() != null ? blog.getStatus() : "draft")
                    .viewCount(blog.getViewCount() != null ? blog.getViewCount() : 0)
                    .createdAt(blog.getCreatedAt())
                    .updatedAt(blog.getUpdatedAt())
                    .publishedAt(blog.getPublishedAt())
                    .commentCount(commentCount)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error mapping blog to response for blog ID: " + blog.getId(), e);
        }
    }

    private BlogCommentResponse mapCommentToResponse(BlogComment comment) {
        return BlogCommentResponse.builder()
                .id(comment.getId())
                .blogId(comment.getBlog().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .userAvatar(comment.getUser().getAvatarUrl())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}