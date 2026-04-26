import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistState = {
  /** Danh sách ID sản phẩm yêu thích (guest & logged-in đều dùng). */
  productIds: number[];
  /** Set dùng cho O(1) lookup — đồng bộ với productIds. */
  _set: Set<number>;

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
      _set: new Set<number>(),

      toggle: (productId) =>
        set((s) => {
          const next = s._set.has(productId)
            ? s.productIds.filter((id) => id !== productId)
            : [...s.productIds, productId];
          return { productIds: next, _set: new Set(next) };
        }),

      add: (productId) =>
        set((s) => {
          if (s._set.has(productId)) return s;
          const next = [...s.productIds, productId];
          return { productIds: next, _set: new Set(next) };
        }),

      remove: (productId) =>
        set((s) => {
          if (!s._set.has(productId)) return s;
          const next = s.productIds.filter((id) => id !== productId);
          return { productIds: next, _set: new Set(next) };
        }),

      setProductIds: (ids) => set({ productIds: ids, _set: new Set(ids) }),

      clear: () => set({ productIds: [], _set: new Set() }),

      /** O(1) lookup thay vì Array.includes O(n). */
      isWishlisted: (productId) => get()._set.has(productId),
    }),
    {
      name: "wishlist_v1",
      storage: createJSONStorage(() => AsyncStorage),
      /** Chỉ persist productIds; _set được tái tạo khi hydrate. */
      partialize: (s) => ({ productIds: s.productIds }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._set = new Set(state.productIds);
        }
      },
    }
  )
);
