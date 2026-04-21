import { create } from "zustand";

type AsideState = {
  isOpen: boolean;
  openAside: () => void;
  closeAside: () => void;
};

export const useAsideStore = create<AsideState>((set) => ({
  isOpen: false,
  openAside: () => set({ isOpen: true }),
  closeAside: () => set({ isOpen: false }),
}));
