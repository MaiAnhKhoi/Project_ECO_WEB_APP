// src/api/categoryApi.ts
import axiosAdmin from "./axiosAdmin";
import type { Category, CategoryPage, ApiResponse } from "../type/category";

const categoryApi = {
  // ===============================
  //             PUBLIC
  // ===============================

  // 📌 Client lấy tất cả category (không phân trang)
  getAllCategories() {
    return axiosAdmin.get<ApiResponse<Category[]>>(`/categories`);
  },

  // ===============================
  //             ADMIN
  // ===============================

  // 📌 Lấy danh sách category (paging)
  getCategoriesAdmin(page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<CategoryPage>>(`/admin/categories`, {
      params: { page, size },
    });
  },

  // 📌 Lấy category theo ID
  getCategory(id: number) {
    return axiosAdmin.get<ApiResponse<Category>>(`/admin/categories/${id}`);
  },

  // 📌 Tạo category (có upload ảnh)
  createCategory(data: FormData) {
    return axiosAdmin.post<ApiResponse<Category>>(`/admin/categories`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 📌 Update category (có upload ảnh)
  updateCategory(id: number, data: FormData) {
    return axiosAdmin.put<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Xóa category
  deleteCategory(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/categories/${id}`);
  },
};

export default categoryApi;
