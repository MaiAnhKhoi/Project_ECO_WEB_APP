import { orderApi } from "@/services/orderApi";
import { useOrderAttentionStore } from "@/store/orderAttentionStore";
import {
  canShowPayOSRetryPay,
  type OrderTabKey,
} from "@/types/order";

const TAB_KEYS: OrderTabKey[] = [
  "all",
  "pending",
  "processing",
  "completed",
  "cancelled",
];

function tabCountsFromTotals(
  entries: readonly (readonly [OrderTabKey, number])[],
): Partial<Record<OrderTabKey, number>> {
  const o: Partial<Record<OrderTabKey, number>> = {};
  for (const [k, v] of entries) {
    if (k !== "all" && v > 0) o[k] = v;
  }
  return o;
}

/**
 * Đếm đơn PayOS cần thanh toán + số đơn mỗi tab (badge kiểu Shopee).
 * Quét tối đa 300 đơn mới nhất để đếm PayOS (đủ cho đa số user).
 */
export async function refreshOrderAttentionBadges(token: string | null) {
  const { setAttention, reset } = useOrderAttentionStore.getState();
  if (!token) {
    reset();
    return;
  }
  try {
    const tabResults = await Promise.all(
      TAB_KEYS.map(async (key) => {
        const status = key === "all" ? undefined : key;
        const res = await orderApi.getMyOrders(token, 0, 1, status);
        return [key, res.totalElements] as const;
      }),
    );

    const allTotal = tabResults.find(([k]) => k === "all")?.[1] ?? 0;
    const scanSize = Math.min(Math.max(allTotal, 1), 300);
    const listRes = await orderApi.getMyOrders(token, 0, scanSize, undefined);
    const payosPendingCount = listRes.content.filter(canShowPayOSRetryPay).length;

    setAttention({
      payosPendingCount,
      orderTabCounts: tabCountsFromTotals(tabResults),
    });
  } catch {
    reset();
  }
}
