import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistState = {
  /** Danh sách ID sản phẩm yêu thích (guest & logged-in đều dùng). */
  productIds: number[];
  toggle: (productId: number) => void;
  add: (productId: number) => void;
  remove: (productId: number) => void;
  /** Ghi đè toàn bộ danh sách (dùng khi đồng bộ từ server). */
  setProductIds: (ids: number[]) => void;
  clear: () => void;
  isWishlisted: (productId: number) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((s) => ({
          productIds: s.productIds.includes(productId)
            ? s.productIds.filter((id) => id !== productId)
            : [...s.productIds, productId],
        })),
      add: (productId) =>
        set((s) => ({
          productIds: s.productIds.includes(productId) ? s.productIds : [...s.productIds, productId],
        })),
      remove: (productId) =>
        set((s) => ({ productIds: s.productIds.filter((id) => id !== productId) })),
      setProductIds: (ids) => set({ productIds: ids }),
      clear: () => set({ productIds: [] }),
      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    {
      name: "wishlist_v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ productIds: s.productIds }),
    }
  )
);
