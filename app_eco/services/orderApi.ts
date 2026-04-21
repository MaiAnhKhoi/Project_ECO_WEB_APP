import { httpClient } from "@/lib/httpClient";
import type {
  CancelOrderRequest,
  CheckoutRequest,
  CheckoutResponse,
  OrderDetail,
  OrderSummaryPage,
  PayOSStatusResponse,
} from "@/types/order";

export const orderApi = {
  /** Danh sách đơn hàng (có phân trang, lọc theo status) */
  getMyOrders: (
    token: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status && status !== "all") params.append("status", status);
    return httpClient.get<OrderSummaryPage>(`/orders?${params.toString()}`, {
      token,
    });
  },

  /** Chi tiết 1 đơn hàng */
  getOrderById: (token: string, orderId: number | string) =>
    httpClient.get<OrderDetail>(`/orders/${orderId}`, { token }),

  /** Hủy đơn hàng */
  cancelOrder: (
    token: string,
    orderId: number | string,
    payload: CancelOrderRequest,
  ) =>
    httpClient.post<void>(`/orders/${orderId}/cancel`, payload, { token }),

  /** Tạo đơn + xử lý thanh toán (COD hoặc PayOS) */
  checkout: (token: string, payload: CheckoutRequest) =>
    httpClient.post<CheckoutResponse>("/checkout", payload, { token }),

  /** Kiểm tra / đồng bộ trạng thái thanh toán PayOS (GET — không tạo link mới) */
  checkPayOSStatus: (token: string, orderId: number | string) =>
    httpClient.get<PayOSStatusResponse>(`/orders/${orderId}/payos/status`, {
      token,
    }),

  /**
   * Thanh toán lại PayOS — BE: POST /orders/{id}/payos/pay (trả CheckoutResponse có link + QR).
   * Giống web: cần endpoint tạo payment-request mới, không dùng GET status.
   */
  repayWithPayOS: (token: string, orderId: number | string) =>
    httpClient.post<CheckoutResponse>(`/orders/${orderId}/payos/pay`, undefined, {
      token,
    }),
};
