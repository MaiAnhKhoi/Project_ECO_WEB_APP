import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChatState = {
  lastReadId: number;
  unreadCount: number;
  chatOpen: boolean;

  setLastReadId: (id: number) => void;
  setUnreadCount: (n: number) => void;
  setChatOpen: (v: boolean) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      lastReadId: 0,
      unreadCount: 0,
      chatOpen: false,

      setLastReadId: (id) => set({ lastReadId: id }),
      setUnreadCount: (n) => set({ unreadCount: n }),
      setChatOpen: (v) => set({ chatOpen: v }),
      reset: () => set({ lastReadId: 0, unreadCount: 0, chatOpen: false }),
    }),
    {
      name: "chat_v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        lastReadId: s.lastReadId,
        unreadCount: s.unreadCount,
      }),
    }
  )
);

