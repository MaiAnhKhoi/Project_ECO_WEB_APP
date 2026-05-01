import { getApiBaseUrl } from "@/config/api";
import { httpClient } from "@/lib/httpClient";
import type {
  CustomerChatApiResponse,
  CustomerChatPage,
  MessageDto,
} from "@/types/customerChat";

export const chatApi = {
  getOrCreateMyThread: (token: string) =>
    httpClient.get<CustomerChatApiResponse<number>>("/customer/chat/thread", { token }),

  getMyMessages: (token: string, page = 0, size = 50) =>
    httpClient.get<CustomerChatApiResponse<CustomerChatPage<MessageDto>>>(
      `/customer/chat/messages?page=${page}&size=${size}`,
      { token }
    ),

  markAllAsRead: (token: string) =>
    httpClient.post<CustomerChatApiResponse<void>>("/customer/chat/read-all", undefined, {
      token,
    }),

  sendMyMessage: (
    token: string,
    payload: {
      text?: string;
      files?: Array<{ uri: string; name: string; type: string }>;
    }
  ) => {
    const form = new FormData();
    if (payload.text) form.append("text", payload.text);
    if (payload.files?.length) {
      for (const f of payload.files) {
        form.append("files", f as any);
      }
    }
    return fetch(`${getApiBaseUrl()}/customer/chat/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`API ${res.status}: ${body || res.statusText}`);
      }
      return (await res.json()) as CustomerChatApiResponse<MessageDto>;
    });
  },
};
