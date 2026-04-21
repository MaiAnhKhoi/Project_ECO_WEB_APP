export interface CouponItem {
  id: number;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  startAt: string | null;
  endAt: string | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  status: string;
}

export interface ApplyCouponRequest {
  code: string;
  subtotal: number;
}

export interface ApplyCouponResponse {
  code: string;
  valid: boolean;
  message: string;
  discountAmount: number;
  finalTotal: number;
}
