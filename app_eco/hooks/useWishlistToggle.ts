import * as Haptics from "expo-haptics";
import { useCallback } from "react";

import { wishlistApi } from "@/services/wishlistApi";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

/**
 * Hook toggle yêu thích dùng chung.
 *
 * - Đã đăng nhập: cập nhật store trước (optimistic), gọi API, rollback nếu lỗi.
 * - Chưa đăng nhập: chỉ toggle local (guest).
 *
 * @example
 *   const toggleWishlist = useWishlistToggle();
 *   <HeartButton onPress={() => toggleWishlist(product.id)} />
 */
export function useWishlistToggle() {
  const token = useAuthStore((s) => s.accessToken);
  const toggle = useWishlistStore((s) => s.toggle);
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);

  return useCallback(
    async (productId: number) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const isCurrently = useWishlistStore.getState().isWishlisted(productId);

      if (token) {
        // Optimistic update — UI phản hồi ngay
        isCurrently ? remove(productId) : add(productId);
        try {
          if (isCurrently) {
            await wishlistApi.removeFromWishlist(token, productId);
          } else {
            await wishlistApi.addToWishlist(token, productId);
          }
        } catch {
          // Rollback nếu API lỗi
          toggle(productId);
        }
      } else {
        // Guest: chỉ lưu local
        toggle(productId);
      }
    },
    [token, toggle, add, remove],
  );
}
