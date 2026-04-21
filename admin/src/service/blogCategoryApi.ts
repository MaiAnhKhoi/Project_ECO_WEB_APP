// src/service/blogCategoryApi.ts
import axiosAdmin from "./axiosAdmin";

// Blog Category types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const blogCategoryApi = {
  // ===============================
  //             ADMIN
  // ===============================

  // 📌 Lấy tất cả blog categories
  getBlogCategories() {
    return axiosAdmin.get<ApiResponse<BlogCategory[]>>(`/admin/blog-categories`);
  },

  // 📌 Lấy blog category theo ID
  getBlogCategory(id: number) {
    return axiosAdmin.get<ApiResponse<BlogCategory>>(`/admin/blog-categories/${id}`);
  },

  // 📌 Tạo blog category
  createBlogCategory(data: BlogCategoryRequest) {
    return axiosAdmin.post<ApiResponse<BlogCategory>>(
      `/admin/blog-categories`,
      data
    );
  },

  // 📌 Update blog category
  updateBlogCategory(id: number, data: BlogCategoryRequest) {
    return axiosAdmin.put<ApiResponse<BlogCategory>>(
      `/admin/blog-categories/${id}`,
      data
    );
  },

  // 📌 Xóa blog category
  deleteBlogCategory(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/blog-categories/${id}`);
  },
};

export default blogCategoryApi;

