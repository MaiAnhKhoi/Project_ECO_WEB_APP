// src/service/chatApi.ts
import axiosAdmin from "./axiosAdmin";
import type {
  ApiResponse,
  PageResult,
  MessageThreadSummary,
  Message,
  SimpleUser,
} from "../type/chat";

const chatApi = {
  // ==============================
  //         ADMIN - THREADS
  // ==============================

  // Thread hỗ trợ khách hàng
  getCustomerThreads(page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<PageResult<MessageThreadSummary>>>(
      `/admin/chat/customer-threads`,
      { params: { page, size } },
    );
  },

  // Thread nội bộ (direct giữa staff với staff/admin)
  getDirectThreads(page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<PageResult<MessageThreadSummary>>>(
      `/admin/chat/direct-threads`,
      { params: { page, size } },
    );
  },

  // Lấy tin nhắn trong 1 thread
  getThreadMessages(threadId: number, page = 0, size = 50) {
    return axiosAdmin.get<ApiResponse<PageResult<Message>>>(
      `/admin/chat/threads/${threadId}/messages`,
      { params: { page, size } },
    );
  },

  // ==============================
  //         USERS
  // ==============================

  // Danh sách nhân viên nội bộ (tab Nội bộ) - trả về mảng thẳng
  getStaffUsers() {
    return axiosAdmin.get<ApiResponse<SimpleUser[]>>(
      `/admin/chat/staff-users`,
    );
  },

  // Danh sách khách hàng (tab Khách hàng) - trả về mảng thẳng
  getCustomerUsers() {
    return axiosAdmin.get<ApiResponse<SimpleUser[]>>(
      `/admin/chat/customer-users`,
    );
  },

  // ==============================
  //         THREAD CREATION
  // ==============================

  // Tạo hoặc lấy thread nội bộ (DIRECT)
  createDirectThread(otherUserId: number) {
    return axiosAdmin.post<ApiResponse<MessageThreadSummary>>(
      `/admin/chat/direct/${otherUserId}/thread`,
    );
  },

  // Tạo hoặc lấy thread hỗ trợ với khách hàng
  createCustomerSupportThread(customerId: number) {
    return axiosAdmin.post<ApiResponse<MessageThreadSummary>>(
      `/admin/chat/customers/${customerId}/thread`,
    );
  },
    markThreadAsRead(threadId: number) {
    return axiosAdmin.post<ApiResponse<void>>(
      `/admin/chat/threads/${threadId}/read-all`,
    );
  },

  // ==============================
  //         MESSAGES
  // ==============================

  // Gửi tin nhắn trong 1 thread (text + files)
  sendMessage(threadId: number, payload: { text?: string; files?: File[] }) {
    const formData = new FormData();
    if (payload.text) formData.append("text", payload.text);
    if (payload.files?.length) {
      payload.files.forEach((file) => formData.append("files", file));
    }

    return axiosAdmin.post<ApiResponse<Message>>(
      `/admin/chat/threads/${threadId}/messages`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};

export default chatApi;
