export interface Banner {
  id: number;
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: string | null;
  active: boolean;
  createdAt: string;
}

// PageResponse dùng chung cho mọi list có phân trang
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number; // current page (0-based nếu backend đang dùng PageRequest.of)
  size: number; // page size
}

// Wrapper chung cho tất cả API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

// Nếu muốn type riêng cho banner page:
export type BannerPage = PageResponse<Banner>;
