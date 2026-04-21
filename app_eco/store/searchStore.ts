import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SearchState = {
  recentKeywords: string[];
  addRecent: (kw: string) => void;
  removeRecent: (kw: string) => void;
  clearRecent: () => void;
};

const MAX_RECENT = 12;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentKeywords: [],
      addRecent: (kw) => {
        const k = kw.trim();
        if (!k) return;
        const prev = get().recentKeywords;
        const next = [k, ...prev.filter((x) => x.toLowerCase() !== k.toLowerCase())].slice(0, MAX_RECENT);
        set({ recentKeywords: next });
      },
      removeRecent: (kw) =>
        set((s) => ({ recentKeywords: s.recentKeywords.filter((x) => x.toLowerCase() !== kw.toLowerCase()) })),
      clearRecent: () => set({ recentKeywords: [] }),
    }),
    {
      name: "search_v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

