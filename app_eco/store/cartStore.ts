import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, CartResponse } from "@/types/cart";

export type GuestCartItem = {
  productId: number;
  quantity: number;
  variantId?: number | null;
  color?: string | null;
  price?: number;
  productName?: string;
  imgSrc?: string;
};

type CartState = {
  /** Giỏ hàng của khách chưa đăng nhập (lưu local). */
  guestItems: GuestCartItem[];
  /** Giỏ hàng từ server (khi đã đăng nhập). */
  serverCart: CartResponse | null;

  /* Guest mutations */
  setGuestItems: (next: GuestCartItem[] | ((prev: GuestCartItem[]) => GuestCartItem[])) => void;
  addGuestItem: (item: GuestCartItem) => void;
  updateGuestQty: (productId: number, qty: number, variantId?: number | null, color?: string | null) => void;
  removeGuestItem: (productId: number, variantId?: number | null, color?: string | null) => void;
  /** Đổi biến thể (giữ số lượng, kẹp theo tồn kho mới; gộp dòng nếu trùng key). */
  changeGuestItemVariant: (
    from: { productId: number; variantId?: number | null; color?: string | null },
    to: {
      variantId: number | null;
      color: string | null;
      price: number;
      maxQuantity?: number;
      imgSrc?: string;
      productName?: string;
    }
  ) => void;
  clearGuestCart: () => void;

  /* Server cart mutations (UI only — API calls happen in screen hooks) */
  setServerCart: (cart: CartResponse | null) => void;
  clearServerCart: () => void;

  /* Computed */
  guestCount: () => number;
  /** Tổng số lượng sản phẩm (server khi đã đăng nhập, guest khi chưa). */
  totalCount: (loggedIn: boolean) => number;
};

const sameKey = (a: GuestCartItem, b: Partial<GuestCartItem>) =>
  a.productId === b.productId &&
  (a.variantId ?? null) === (b.variantId ?? null) &&
  (a.color ?? null) === (b.color ?? null);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestItems: [],
      serverCart: null,

      setGuestItems: (next) =>
        set((s) => ({
          guestItems: typeof next === "function" ? (next as (p: GuestCartItem[]) => GuestCartItem[])(s.guestItems) : next,
        })),

      addGuestItem: (item) =>
        set((s) => {
          const idx = s.guestItems.findIndex((x) => sameKey(x, item));
          if (idx === -1) return { guestItems: [...s.guestItems, item] };
          const next = [...s.guestItems];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
          return { guestItems: next };
        }),

      updateGuestQty: (productId, qty, variantId, color) =>
        set((s) => ({
          guestItems:
            qty <= 0
              ? s.guestItems.filter((x) => !sameKey(x, { productId, variantId, color }))
              : s.guestItems.map((x) =>
                  sameKey(x, { productId, variantId, color }) ? { ...x, quantity: qty } : x
                ),
        })),

      removeGuestItem: (productId, variantId, color) =>
        set((s) => ({
          guestItems: s.guestItems.filter((x) => !sameKey(x, { productId, variantId, color })),
        })),

      changeGuestItemVariant: (from, to) =>
        set((s) => {
          const idx = s.guestItems.findIndex((x) => sameKey(x, from));
          if (idx === -1) return {};
          const old = s.guestItems[idx];
          const maxQ = to.maxQuantity ?? Number.POSITIVE_INFINITY;
          const newQty = Math.min(old.quantity, maxQ);
          const rest = s.guestItems.filter((_, i) => i !== idx);
          const mergedVar = to.variantId ?? null;
          const mergedColor = to.color ?? null;
          if (newQty <= 0) {
            return { guestItems: rest };
          }
          const dupIdx = rest.findIndex((x) =>
            sameKey(x, { productId: old.productId, variantId: mergedVar, color: mergedColor })
          );
          let guestItems: GuestCartItem[];
          if (dupIdx >= 0) {
            guestItems = rest.map((x, i) =>
              i === dupIdx ? { ...x, quantity: x.quantity + newQty } : x
            );
          } else {
            guestItems = [
              ...rest,
              {
                productId: old.productId,
                quantity: newQty,
                variantId: mergedVar,
                color: mergedColor,
                price: to.price,
                imgSrc: to.imgSrc ?? old.imgSrc,
                productName: to.productName ?? old.productName,
              },
            ];
          }
          return { guestItems };
        }),

      clearGuestCart: () => set({ guestItems: [] }),

      setServerCart: (cart) => set({ serverCart: cart }),
      clearServerCart: () => set({ serverCart: null }),

      guestCount: () => get().guestItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
      totalCount: (loggedIn) => {
        if (loggedIn) {
          return get().serverCart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
        }
        return get().guestCount();
      },
    }),
    {
      name: "cart_guest_v1",
      storage: createJSONStorage(() => AsyncStorage),
      /** Chỉ lưu giỏ guest; serverCart không cần persist. */
      partialize: (s) => ({ guestItems: s.guestItems }),
    }
  )
);
