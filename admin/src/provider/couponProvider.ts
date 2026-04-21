import couponApi from "../service/couponApi";
import type { Coupon, CouponPage } from "../type/coupon";
import { getPaginationFromUrl } from "../utils/pagination";

export const couponProvider = {
  // ⚡ getList cho Refine (admin coupons)
  async getList(params: any) {
    const { pagination, filters } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let keyword: string | undefined;
    let status: string | undefined;

    if (Array.isArray(filters)) {
      for (const f of filters) {
        if (f.field === "keyword") keyword = f.value;
        if (f.field === "status") status = f.value;
      }
    }

    const res = await couponApi.getCouponsAdmin(
      current - 1,
      pageSize,
      keyword,
      status
    );

    const wrapped = res.data as { success: boolean; data: CouponPage };
    const page: CouponPage = wrapped.data;

    return {
      data: page.content,
      total: page.totalElements,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await couponApi.getCoupon(id);
    const wrapped = res.data as { success: boolean; data: Coupon };
    const coupon: Coupon = wrapped.data;

    return {
      data: coupon,
    };
  },

  // ⚡ create coupon (JSON)
  async create(params: any) {
    const { variables } = params;

    const res = await couponApi.createCoupon(variables);
    const wrapped = res.data as { success: boolean; data: Coupon };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update coupon (JSON)
  async update(params: any) {
    const { id, variables } = params;

    const res = await couponApi.updateCoupon(id, variables);
    const wrapped = res.data as { success: boolean; data: Coupon };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete coupon
  async deleteOne(params: any) {
    const { id } = params;

    const res = await couponApi.deleteCoupon(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};
