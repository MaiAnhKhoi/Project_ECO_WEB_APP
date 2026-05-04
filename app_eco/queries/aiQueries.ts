import { useQuery } from "@tanstack/react-query";

import {
 fetchAITrending,
 fetchAIRecommendations,
 fetchAIChatHistory,
 fetchAIConversation,
} from "@/services/aiApi";
import type { ProductRecommendRequest } from "@/types/ai";
import { useAuthStore } from "@/store/authStore";

// ============================================================
// Query keys — tập trung để invalidate nhất quán
// ============================================================

export const AI_QUERY_KEYS = {
  trending: (limit: number) => ["ai", "recommend", "trending", limit] as const,
  recommendations: (req: ProductRecommendRequest) =>
    ["ai", "recommend", "products", JSON.stringify(req)] as const,
  chatHistory: (page: number) => ["ai", "chat", "history", page] as const,
  conversation: (id: number) => ["ai", "chat", "conversation", id] as const,
  styleHistory: (page: number) => ["ai", "history", "style", page] as const,
  styleHistoryDetail: (id: number) => ["ai", "history", "style", "detail", id] as const,
  outfitHistory: (page: number) => ["ai", "history", "outfits", page] as const,
  outfitHistoryDetail: (logId: number) =>
    ["ai", "history", "outfits", "detail", logId] as const,
};

// ============================================================
// AI Trending — home screen (staleTime 10 phút, cache 15 phút)
// ============================================================

export function useAITrendingQuery(limit = 10) {
  return useQuery({
    queryKey: AI_QUERY_KEYS.trending(limit),
    queryFn: () => fetchAITrending(limit),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });
}

// ============================================================
// AI Personalized recommendations
// ============================================================

export function useAIRecommendationsQuery(
  req: ProductRecommendRequest,
  enabled = true
) {
  return useQuery({
    queryKey: AI_QUERY_KEYS.recommendations(req),
    queryFn: () => fetchAIRecommendations(req),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================
// Chat history (paginated)
// ============================================================

export function useAIChatHistoryQuery(page = 0, enabled = true) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: AI_QUERY_KEYS.chatHistory(page),
    queryFn: () => fetchAIChatHistory(page),
    enabled: enabled && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

// ============================================================
// Conversation detail
// ============================================================

export function useAIConversationQuery(id: number | undefined) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: id ? AI_QUERY_KEYS.conversation(id) : [],
    queryFn: () => fetchAIConversation(id!),
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 5,
  });
}

