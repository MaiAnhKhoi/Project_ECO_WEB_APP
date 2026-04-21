import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/types/product";

type CompareState = {
  products: Product[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  toggle: (product: Product) => void;
  clear: () => void;
  isCompared: (productId: number) => boolean;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      add: (product) =>
        set((s) => {
          if (s.products.some((p) => p.id === product.id)) return s;
          return { products: [...s.products, product] };
        }),
      remove: (productId) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== productId) })),
      toggle: (product) =>
        set((s) => {
          if (s.products.some((p) => p.id === product.id)) {
            return { products: s.products.filter((p) => p.id !== product.id) };
          }
          return { products: [...s.products, product] };
        }),
      clear: () => set({ products: [] }),
      isCompared: (productId) => get().products.some((p) => p.id === productId),
    }),
    {
      name: "compare_v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ products: s.products }),
    }
  )
);
