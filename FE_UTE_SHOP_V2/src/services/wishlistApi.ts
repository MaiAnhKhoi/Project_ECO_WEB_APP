import api from "@/config/api";

const wishlistApi = {
  // Lấy danh sách sản phẩm yêu thích (phân trang 16 card)
  getWishlist(page: number = 0, size: number = 16) {
    return api.get(`/wishlist`, {
      params: { page, size },
    });
  },

  // Thêm vào danh sách yêu thích
  addToWishlist(productId: number, variantId?: number) {
    return api.post(`/wishlist`, {
      productId,
      variantId: variantId ?? null,
    });
  },

  // Xóa khỏi danh sách yêu thích
  removeFromWishlist(productId: number, variantId?: number) {
    return api.delete(`/wishlist`, {
      params: {
        productId,
        variantId,
      },
    });
  },
};

export default wishlistApi;
