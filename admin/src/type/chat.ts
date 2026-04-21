// src/type/chat.ts

export interface Attachment {
  id: number;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
}

export interface Message {
  id: number;
  threadId: number;
  senderId: number;
  senderName: string;
  contentText: string | null;
  createdAt: string; // ISO
  mine: boolean;
  read: boolean;
  attachments: Attachment[];
}

export interface MessageThreadSummary {
  id: number;
  subject: string;
  otherUserId: number | null;
  otherUserName: string;
  lastMessagePreview: string | null;
  lastMessageTime: string;
  unreadCount: number;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// đơn giản hoá ApiResponse, giống kiểu backend của bạn
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
export type SimpleUser = {
  id: number;
  name: string;
  email?: string;
};
