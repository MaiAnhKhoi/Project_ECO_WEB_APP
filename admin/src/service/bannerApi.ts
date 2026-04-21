// src/service/bannerApi.ts
import axiosAdmin from "./axiosAdmin";
import type { Banner, BannerPage, ApiResponse } from "../type/banner";

// Nếu vẫn muốn giữ BannerPayload để tái dùng ở chỗ khác thì cứ giữ:
export interface BannerPayload {
  title: string;
  linkUrl?: string | null;
  position?: string | null;
  active?: boolean;
  imageUrl?: string | null;
}

const bannerApi = {
  // ===============================
  //             ADMIN
  // ===============================

  getBannersAdmin(
    page = 0,
    size = 20,
    position?: string,
    active?: boolean,
    keyword?: string,
  ) {
    return axiosAdmin.get<ApiResponse<BannerPage>>(`/admin/banners`, {
      params: { page, size, position, active, keyword },
    });
  },

  getBanner(id: number) {
    return axiosAdmin.get<ApiResponse<Banner>>(`/admin/banners/${id}`);
  },

  // ❌ Đừng dùng BannerPayload ở đây nữa
  // createBanner(data: BannerPayload) { ... }

  // ✅ Tạo banner bằng FormData (multipart/form-data)
  createBanner(formData: FormData) {
    return axiosAdmin.post<ApiResponse<Banner>>(
      `/admin/banners`,
      formData,
    );
  },

  // ❌ Tương tự, bỏ BannerPayload
  // updateBanner(id: number, data: BannerPayload) { ... }

  // ✅ Update banner bằng FormData
  updateBanner(id: number, formData: FormData) {
    return axiosAdmin.put<ApiResponse<Banner>>(
      `/admin/banners/${id}`,
      formData,
    );
  },

  deleteBanner(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/banners/${id}`);
  },

  updateActive(id: number, active: boolean) {
    return axiosAdmin.patch<ApiResponse<Banner>>(
      `/admin/banners/${id}/active`,
      null,
      { params: { active } },
    );
  },
};

export default bannerApi;
