// src/api/brandApi.ts
import axiosAdmin from "./axiosAdmin";
import type { Brand, BrandPage, ApiResponse } from "../type/brand";

const brandApi = {
  // ===============================
  //             PUBLIC
  // ===============================

  // 📌 Client lấy tất cả brand (không phân trang)
  getAllBrands() {
    return axiosAdmin.get<ApiResponse<Brand[]>>(`/brands`);
  },

  // ===============================
  //             ADMIN
  // ===============================

  // 📌 Lấy danh sách brand (paging)
  getBrandsAdmin(page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<BrandPage>>(`/admin/brands`, {
      params: { page, size },
    });
  },

  // 📌 Lấy brand theo ID
  getBrand(id: number) {
    return axiosAdmin.get<ApiResponse<Brand>>(`/admin/brands/${id}`);
  },

  // 📌 Tạo brand (có upload ảnh)
  createBrand(data: FormData) {
    return axiosAdmin.post<ApiResponse<Brand>>(`/admin/brands`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 📌 Update brand (có upload ảnh)
  updateBrand(id: number, data: FormData) {
    return axiosAdmin.put<ApiResponse<Brand>>(
      `/admin/brands/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Xóa brand
  deleteBrand(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/brands/${id}`);
  },
};

export default brandApi;
