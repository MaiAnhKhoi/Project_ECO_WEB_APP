import { httpClient } from "@/lib/httpClient";
import type { CartItem, CartResponse, CartVariantOption } from "@/types/cart";

export type { CartItem, CartResponse, CartVariantOption };

/**
 * BE (CartService): bắt buộc `variantId` hoặc `color` không rỗng (không null/blank).
 * Sản phẩm không map được màu/size trên app vẫn có biến thể trên server → gửi sentinel
 * để `resolveVariantForAdd` fallback sang variant mặc định.
 */
const DEFAULT_COLOR_SENTINEL = ".";

function buildAddCartBody(payload: {
  productId: number;
  quantity: number;
  variantId?: number | null;
  color?: string | null;
}) {
  const productId = payload.productId;
  const quantity = payload.quantity;
  const rawVid = payload.variantId;
  const variantId =
    rawVid != null && Number.isFinite(Number(rawVid)) && Number(rawVid) > 0
      ? Number(rawVid)
      : undefined;
  const colorTrim =
    typeof payload.color === "string" && payload.color.trim().length > 0
      ? payload.color.trim()
      : undefined;

  if (variantId != null) {
    return {
      productId,
      quantity,
      variantId,
      ...(colorTrim ? { color: colorTrim } : {}),
    };
  }

  return {
    productId,
    quantity,
    color: colorTrim ?? DEFAULT_COLOR_SENTINEL,
  };
}

export const cartApi = {
  getMyCart: (token: string) =>
    httpClient.get<CartResponse>("/cart/my", { token }),

  addToCart: (
    token: string,
    payload: {
      productId: number;
      quantity: number;
      variantId?: number | null;
      color?: string | null;
    }
  ) =>
    httpClient.post<CartResponse>(
      "/cart/items",
      buildAddCartBody(payload),
      { token },
    ),

  updateItem: (
    token: string,
    itemId: number,
    payload: { quantity?: number; variantId?: number | null }
  ) => httpClient.patch<CartResponse>(`/cart/items/${itemId}`, payload, { token }),

  removeItem: (token: string, itemId: number) =>
    httpClient.delete<CartResponse>(`/cart/items/${itemId}`, { token }),
};
