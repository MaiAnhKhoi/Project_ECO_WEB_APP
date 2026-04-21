// src/services/chatApi.ts
import api from "@/config/api";
import { ApiResponse } from "@/types/chat";
import { PageResponse } from "@/types";
import { MessageDto } from "@/types/chat";

const chatApi = {
  // 🔹 Lấy / tạo thread hỗ trợ hiện tại của user, trả về threadId
  getOrCreateMyThread() {
    return api.get<ApiResponse<number>>("/customer/chat/thread");
  },

  // 🔹 Lấy tin nhắn trong thread hỗ trợ của user
  getMyMessages(page = 0, size = 50) {
    return api.get<ApiResponse<PageResponse<MessageDto>>>(
      "/customer/chat/messages",
      {
        params: { page, size },
      },
    );
  },

  // 🔹 Gửi tin nhắn (text + files)
  sendMyMessage(payload: { text?: string; files?: File[] }) {
    const formData = new FormData();
    if (payload.text) {
      formData.append("text", payload.text);
    }
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((f) => formData.append("files", f));
    }

    return api.post<ApiResponse<MessageDto>>(
      "/customer/chat/messages",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  // 🔹 Đánh dấu đã đọc tất cả tin trong thread hỗ trợ
  markAllAsRead() {
    return api.post<ApiResponse<void>>("/customer/chat/read-all");
  },
};

export default chatApi;
