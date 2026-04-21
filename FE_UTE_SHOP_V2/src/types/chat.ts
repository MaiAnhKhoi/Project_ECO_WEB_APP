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

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}
