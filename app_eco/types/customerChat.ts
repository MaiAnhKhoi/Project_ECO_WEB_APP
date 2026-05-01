/** Chat hỗ trợ khách hàng (thread với admin) — `/customer/chat/*` */

export interface MessageAttachment {
  id: number;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
}

export interface MessageDto {
  id: number;
  threadId: number;
  senderId: number;
  senderName: string;
  contentText?: string | null;
  createdAt: string;
  mine: boolean;
  read: boolean;
  attachments: MessageAttachment[];
}

export interface CustomerChatPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CustomerChatApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}
