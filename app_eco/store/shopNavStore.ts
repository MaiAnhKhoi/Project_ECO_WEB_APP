import { create } from "zustand";

/**
 * Store tạm thời (không persist) để truyền filter từ màn Home → màn Shop.
 * CategorySection / BrandSection ghi vào đây rồi navigate sang tab Shop.
 * ShopScreen đọc và clear khi focus.
 */
type PendingShopNav = {
  categorySlug?: string;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
};

type ShopNavState = {
  pending: PendingShopNav | null;
  setPending: (nav: PendingShopNav) => void;
  clearPending: () => void;
};

export const useShopNavStore = create<ShopNavState>()((set) => ({
  pending: null,
  setPending: (nav) => set({ pending: nav }),
  clearPending: () => set({ pending: null }),
}));
