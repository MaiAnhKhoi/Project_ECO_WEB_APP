import api from "@/config/api";
import type { ApplyCouponRequest, ApplyCouponResponse, CouponItem } from "@/types/coupon";

// API Coupon
const couponApi = {
  // Lấy tất cả mã giảm giá đang hoạt động dựa trên token
  getActiveCoupons() {
    return api.get<CouponItem[]>("/coupons/active");
  },

  // Áp dụng mã giảm giá
  applyCoupon(data: ApplyCouponRequest) {
    return api.post<ApplyCouponResponse>("/coupons/apply", data);
  },
};

export default couponApi;
