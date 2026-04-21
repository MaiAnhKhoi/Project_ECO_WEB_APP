// src/provider/orderProvider.ts
import orderApi from "../service/orderApi";
import type {
  OrderPage,
  OrderDetail,
} from "../type/order";
import { getPaginationFromUrl } from "../utils/pagination";

export const orderProvider = {
  // ⚡ getList cho Refine (admin orders)
  async getList(params: any) {
    const { pagination, filters } = params;

    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let status: string | undefined;
    let paymentStatus: string | undefined;
    let keyword: string | undefined;

    if (Array.isArray(filters)) {
      for (const f of filters) {
        if (f.field === "status") status = f.value;
        if (f.field === "paymentStatus") paymentStatus = f.value;
        if (f.field === "keyword" || f.field === "q") keyword = f.value;
      }
    }

    console.log("🔥 orderProvider.getList -> current =", current, "pageSize =", pageSize);

    const res = await orderApi.getOrdersAdmin(
      current - 1,      // BE 0-based
      pageSize,
      status,
      paymentStatus,
      keyword
    );

    const wrapped = res.data as { success: boolean; data: OrderPage } | OrderPage;
    const page: OrderPage =
      (wrapped as any).data?.content !== undefined
        ? (wrapped as any).data
        : (wrapped as any);

    return {
      data: page.content ?? [],
      total: page.totalElements ?? 0,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;
    const numericId = Number(id); // 🔧 convert BaseKey -> number

    const res = await orderApi.getOrder(numericId);
    const wrapped = res.data as { success: boolean; data: OrderDetail } | OrderDetail;
    const order: OrderDetail = (wrapped as any).data ?? (wrapped as any);

    return {
      data: order,
    };
  },

  async create() {
    throw new Error("Create order from admin is not supported.");
  },

  async update() {
    throw new Error("Update order from admin is not supported.");
  },

  async deleteOne() {
    throw new Error("Delete order from admin is not supported.");
  },
};
