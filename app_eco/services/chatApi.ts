import { getApiBaseUrl } from "@/config/api";
import { httpClient } from "@/lib/httpClient";

export type MessageAttachment = {
  id: number;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
};

export type MessageDto = {
  id: number;
  threadId: number;
  senderId: number;
  senderName: string;
  contentText?: string | null;
  createdAt: string;
  mine: boolean;
  read: boolean;
  attachments: MessageAttachment[];
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export const chatApi = {
  getOrCreateMyThread: (token: string) =>
    httpClient.get<ApiResponse<number>>("/customer/chat/thread", { token }),

  getMyMessages: (token: string, page = 0, size = 50) =>
    httpClient.get<ApiResponse<PageResponse<MessageDto>>>(
      `/customer/chat/messages?page=${page}&size=${size}`,
      { token }
    ),

  markAllAsRead: (token: string) =>
    httpClient.post<ApiResponse<void>>("/customer/chat/read-all", undefined, {
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
      return (await res.json()) as ApiResponse<MessageDto>;
    });
  },
};

