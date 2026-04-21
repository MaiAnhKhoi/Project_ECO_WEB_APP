import axiosAdmin from "./axiosAdmin";
import type { Coupon, CouponPage, ApiResponse } from "../type/coupon";

const couponApi = {
  // ===============================
  //             ADMIN
  // ===============================

  // 📌 Lấy danh sách coupon (paging + filter)
  getCouponsAdmin(
    page = 0,
    size = 20,
    keyword?: string,
    status?: string
  ) {
    return axiosAdmin.get<ApiResponse<CouponPage>>(`/admin/coupons`, {
      params: {
        page,
        size,
        keyword,
        status,
      },
    });
  },

  // 📌 Lấy coupon theo ID
  getCoupon(id: number) {
    return axiosAdmin.get<ApiResponse<Coupon>>(`/admin/coupons/${id}`);
  },

  // 📌 Tạo coupon (JSON)
  createCoupon(data: Partial<Coupon>) {
    return axiosAdmin.post<ApiResponse<Coupon>>(`/admin/coupons`, data);
  },

  // 📌 Update coupon (JSON)
  updateCoupon(id: number, data: Partial<Coupon>) {
    return axiosAdmin.put<ApiResponse<Coupon>>(
      `/admin/coupons/${id}`,
      data
    );
  },

  // 📌 Xóa coupon (soft delete)
  deleteCoupon(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/coupons/${id}`);
  },

  // 📌 Cập nhật status (active/inactive/expired/...)
  updateStatus(id: number, status: string) {
    return axiosAdmin.patch<ApiResponse<Coupon>>(
      `/admin/coupons/${id}/status`,
      null,
      { params: { status } }
    );
  },
};

export default couponApi;
