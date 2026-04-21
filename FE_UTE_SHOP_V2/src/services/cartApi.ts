// src/services/cartApi.ts
import api from "@/config/api";
import type { CartResponse } from "@/types/cart";

const cartApi = {
  // ✅ Lấy giỏ hàng hiện tại của user
  getMyCart() {
    // BE mapping: GET /api/cart/my  (config api đã có prefix /api)
    return api.get<CartResponse>("/cart/my");
  },

  // ✅ Thêm sản phẩm vào giỏ
  addToCart(payload: {
    productId: number;
    quantity: number;
    variantId?: number | null;
    color?: string | null;
  }) {
    return api.post<CartResponse>("/cart/items", payload);
  },


  // ✅ Cập nhật 1 item (có thể chỉ đổi quantity, hoặc chỉ đổi variantId, hoặc cả hai)
  updateItem(
    itemId: number,
    data: { quantity?: number; variantId?: number | null }
  ) {
    return api.patch<CartResponse>(`/cart/items/${itemId}`, data);
  },

  // ✅ Xoá 1 item khỏi giỏ
  removeItem(itemId: number) {
    return api.delete<CartResponse>(`/cart/items/${itemId}`);
  },

  // (❌) Không cần nữa, nhưng nếu thích để wrapper cho dễ đọc:
  changeItemVariant(itemId: number, variantId: number) {
    return api.patch<CartResponse>(`/cart/items/${itemId}`, { variantId });
  },

  // (❌) Không cần /cart/{productId}/cart-variants nữa vì variantOptions đã đi kèm mỗi item
  // getCartVariants(productId: number) { ... }  -> có thể xoá
};

export default cartApi;
