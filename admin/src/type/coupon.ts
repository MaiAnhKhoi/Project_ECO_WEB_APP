export type CouponType = "PERCENT" | "FIXED";

export interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  startAt?: string | null;
  endAt?: string | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  usedCount?: number | null;
  status: string;
  createdAt?: string;
}

export interface CouponPage {
  content: Coupon[];
  totalElements: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
