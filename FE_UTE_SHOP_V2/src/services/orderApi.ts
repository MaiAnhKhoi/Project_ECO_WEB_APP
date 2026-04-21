// src/services/orderApi.ts
import api from "@/config/api";
import type {
  CheckoutRequest,
  CheckoutResponse,
  OrderDetail,
  OrderSummaryPage,
  CancelOrderRequest,
} from "@/types/order";

const orderApi = {
  /**
   * Tạo đơn + gọi PayOS (checkout)
   */
  checkout(data: CheckoutRequest) {
    return api.post<CheckoutResponse>("/checkout", data);
  },

  /**
   * Lấy chi tiết 1 đơn hàng theo id
   */
  getOrderById(orderId: number | string) {
    return api.get<OrderDetail>(`/orders/${orderId}`);
  },

  /**
   * Lấy danh sách đơn hàng của user (có phân trang)
   * ⚠️ BE hiện đang dùng GET /api/orders nên FE là "/orders"
   */
  getMyOrders(page = 0, size = 10) {
    return api.get<OrderSummaryPage>("/orders", {
      params: { page, size },
    });
  },

  /**
   * Thanh toán lại bằng PayOS cho đơn chưa thanh toán (retry)
   */
retryPayWithPayOS(orderId: number | string) {
  return api.get<{
    orderId: number;
    orderStatus: string;
    paymentStatus: string;
    paymentExpiresAt: string | null;
    canRePay: boolean;
  }>(`/orders/${orderId}/payos/status`);
},

  /**
   * Lấy trạng thái thanh toán / đơn hàng từ PayOS (sync trực tiếp)
   */
checkPayOSStatus(orderId: number | string) {
  return api.get<{
    orderId: number;
    orderStatus: string;
    paymentStatus: string;
    paymentExpiresAt: string | null;
    canRePay: boolean;
  }>(`/orders/${orderId}/payos/status`);
},


  /**
   * ❌ User hủy đơn hàng
   */
  cancelOrder(orderId: number | string, payload: CancelOrderRequest) {
    return api.post(`/orders/${orderId}/cancel`, payload);
  },
};

export default orderApi;
