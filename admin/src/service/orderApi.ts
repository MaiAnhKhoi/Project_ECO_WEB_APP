import axiosAdmin from "./axiosAdmin";
import type {
  ApiResponse,
  OrderPage,
  OrderDetail,
  AdminUpdateOrderStatusRequest,
  AdminUpdateShippingStatusRequest,
} from "../type/order";

const orderApi = {
  // ===============================
  //             ADMIN
  // ===============================

  getOrdersAdmin(page = 0, size = 20, status?: string, paymentStatus?: string, keyword?: string) {
    return axiosAdmin.get<ApiResponse<OrderPage>>(`/admin/orders`, {
      params: { page, size, status, paymentStatus, keyword },
    });
  },

  getOrder(id: number) {
    return axiosAdmin.get<ApiResponse<OrderDetail>>(`/admin/orders/${id}`);
  },

  updateOrderStatus(id: number, payload: AdminUpdateOrderStatusRequest) {
    return axiosAdmin.put<ApiResponse<null>>(`/admin/orders/${id}/status`, payload);
  },

  updateShippingStatus(id: number, payload: AdminUpdateShippingStatusRequest) {
    return axiosAdmin.put<ApiResponse<null>>(`/admin/orders/${id}/shipping-status`, payload);
  },

  adminCancelOrder(id: number, reason?: string) {
    return axiosAdmin.post<ApiResponse<null>>(`/admin/orders/${id}/cancel`, null, {
      params: { reason },
    });
  },

  // ==================================
  //             REFUND
  // ==================================

  // Lấy danh sách refund
  getRefunds(page = 0, size = 20, status?: string) {
    return axiosAdmin.get<ApiResponse<any>>(`/admin/refunds`, {
      params: { page, size, status },
    });
  },

  // Lấy chi tiết refund
  getRefundDetail(refundId: number) {
    return axiosAdmin.get<ApiResponse<any>>(`/admin/orders/refund/${refundId}`);
  },

  // Admin bắt đầu xử lý refund
  adminConfirmRefund(refundId: number) {
    return axiosAdmin.post<ApiResponse<null>>(`/admin/orders/refund/${refundId}/confirm`);
  },

  // Admin đánh dấu đã hoàn tiền
  adminCompleteRefund(refundId: number) {
    return axiosAdmin.post<ApiResponse<null>>(`/admin/orders/refund/${refundId}/complete`);
  },
};

export default orderApi;
