import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { chatApi } from "@/services/chatApi";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";

export function useChatUnreadCount() {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const lastReadId = useChatStore((s) => s.lastReadId);
  const chatOpen = useChatStore((s) => s.chatOpen);
  const setUnreadCount = useChatStore((s) => s.setUnreadCount);

  const q = useQuery({
    queryKey: ["chatUnreadCount", user?.id, lastReadId],
    enabled: !!token && !!user,
    refetchInterval: chatOpen ? false : 12_000,
    queryFn: async () => {
      const res = await chatApi.getMyMessages(token!, 0, 50);
      const list = res.data?.content ?? [];
      const unread = list.filter((m) => m.id > lastReadId && !m.mine).length;
      return unread;
    },
  });

  useEffect(() => {
    if (typeof q.data === "number") setUnreadCount(q.data);
  }, [q.data, setUnreadCount]);

  useEffect(() => {
    if (!token || !user) setUnreadCount(0);
  }, [token, user, setUnreadCount]);

  return { unreadCount: q.data ?? 0, isLoading: q.isFetching };
}

