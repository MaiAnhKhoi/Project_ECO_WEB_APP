import type { Product } from "./product";

/** Phản hồi phân trang wishlist — khớp BE; khác `PageResponse` ở productPage (optional fields). */
export interface WishlistPageResponse {
  content: Product[];
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}
