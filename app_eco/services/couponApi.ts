import { httpClient } from "@/lib/httpClient";
import type {
  ApplyCouponRequest,
  ApplyCouponResponse,
  CouponItem,
} from "@/types/coupon";

export const couponApi = {
  getActiveCoupons: (token: string) =>
    httpClient.get<CouponItem[]>("/coupons/active", { token }),

  applyCoupon: (token: string, payload: ApplyCouponRequest) =>
    httpClient.post<ApplyCouponResponse>("/coupons/apply", payload, { token }),
};
