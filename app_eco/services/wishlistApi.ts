import { httpClient } from "@/lib/httpClient";
import type { WishlistPageResponse } from "@/types/wishlist";

export const wishlistApi = {
  getWishlist: (token: string, page: number = 0, size: number = 16) =>
    httpClient.get<WishlistPageResponse>(`/wishlist?page=${page}&size=${size}`, { token }),
  addToWishlist: (token: string, productId: number, variantId?: number) =>
    httpClient.post(`/wishlist`, { productId, variantId: variantId ?? null }, { token }),
  removeFromWishlist: (token: string, productId: number, variantId?: number) =>
    httpClient.delete(`/wishlist?productId=${productId}${variantId != null ? `&variantId=${variantId}` : ""}`, { token }),
};
