import { create } from "zustand";

import type { OrderTabKey } from "@/types/order";

export type OrderTabCounts = Partial<Record<OrderTabKey, number>>;

type State = {
  /** Đơn PayOS còn trong hạn / có thể thanh toán (badge đỏ tab Đơn hàng) */
  payosPendingCount: number;
  /** Số đơn theo từng tab lọc (Tất cả không dùng) */
  orderTabCounts: OrderTabCounts;
  setAttention: (p: { payosPendingCount: number; orderTabCounts: OrderTabCounts }) => void;
  reset: () => void;
};

export const useOrderAttentionStore = create<State>((set) => ({
  payosPendingCount: 0,
  orderTabCounts: {},
  setAttention: (p) => set(p),
  reset: () => set({ payosPendingCount: 0, orderTabCounts: {} }),
}));
