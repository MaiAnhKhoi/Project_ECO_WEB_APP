// src/service/blogApi.ts
import axiosAdmin from "./axiosAdmin";

// Common types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Blog types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar?: string;
}

export interface BlogResponse {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  author: BlogAuthor;
  category?: BlogCategory;
  tags?: string;
  status: string;
  viewCount: number;
  commentCount?: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface BlogPage extends PageResponse<BlogResponse> {}

export interface BlogRequest {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: number;
  tags?: string;
  status?: string;
}

const blogApi = {
  // ===============================
  //             ADMIN
  // ===============================

  // 📌 Lấy danh sách blog posts (paging + filter)
  getBlogsAdmin(
    page = 0,
    size = 10,
    keyword?: string,
    status?: string,
    categoryId?: number
  ) {
    return axiosAdmin.get<ApiResponse<BlogPage>>(`/admin/blog-posts`, {
      params: { page, size, keyword, status, categoryId },
    });
  },

  // 📌 Lấy blog post theo ID
  getBlog(id: number) {
    return axiosAdmin.get<ApiResponse<BlogResponse>>(`/admin/blog-posts/${id}`);
  },

  // 📌 Tạo blog post (có thể upload ảnh)
  createBlog(data: BlogRequest | FormData) {
    return axiosAdmin.post<ApiResponse<BlogResponse>>(
      `/admin/blog-posts`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    );
  },

  // 📌 Update blog post (có thể upload ảnh)
  updateBlog(id: number, data: BlogRequest | FormData) {
    return axiosAdmin.put<ApiResponse<BlogResponse>>(
      `/admin/blog-posts/${id}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    );
  },

  // 📌 Xóa blog post
  deleteBlog(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/blog-posts/${id}`);
  },
};

export default blogApi;

