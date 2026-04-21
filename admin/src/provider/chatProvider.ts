// src/provider/chatProvider.ts
import chatApi from "../service/chatApi";
import type { MessageThreadSummary, PageResult, ApiResponse } from "../type/chat";
import { getPaginationFromUrl } from "../utils/pagination";

export const chatProvider = {
  // dùng cho Refine getList
  async getList(params: any) {
    const { resource, pagination } = params as any;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    if (resource === "customer-chat-threads") {
      const res = await chatApi.getCustomerThreads(current - 1, pageSize);
      const wrapped = res.data as ApiResponse<PageResult<MessageThreadSummary>>;
      const page = wrapped.data;

      return {
        data: page.content,
        total: page.totalElements,
      };
    }

    if (resource === "direct-chat-threads") {
      const res = await chatApi.getDirectThreads(current - 1, pageSize);
      const wrapped = res.data as ApiResponse<PageResult<MessageThreadSummary>>;
      const page = wrapped.data;

      return {
        data: page.content,
        total: page.totalElements,
      };
    }

    throw new Error(`chatProvider: unsupported resource ${resource}`);
  },
};
