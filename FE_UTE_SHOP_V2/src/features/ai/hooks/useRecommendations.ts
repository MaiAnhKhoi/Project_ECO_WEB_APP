import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchRecommendations, fetchTrending, generateOutfit } from "../api/aiApi";
import type { OutfitRequest, ProductRecommendRequest } from "../types";

export const AI_RECOMMEND_KEYS = {
  trending: (limit: number) => ["ai", "recommend", "trending", limit] as const,
  personalized: (userId?: number) => ["ai", "recommend", "personalized", userId] as const,
};

// -----------------------------------------------------------------
// useTrending — trending products (cached 10 min via React Query)
// -----------------------------------------------------------------
export function useTrending(limit = 10) {
  return useQuery({
    queryKey: AI_RECOMMEND_KEYS.trending(limit),
    queryFn: () => fetchTrending(limit),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });
}

// -----------------------------------------------------------------
// usePersonalizedRecommendations
// -----------------------------------------------------------------
export function usePersonalizedRecommendations(
  request: ProductRecommendRequest,
  enabled = true
) {
  return useQuery({
    queryKey: ["ai", "recommend", "products", JSON.stringify(request)],
    queryFn: () => fetchRecommendations(request),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

// -----------------------------------------------------------------
// useOutfitGenerator — mutation (one-shot per prompt)
// -----------------------------------------------------------------
export function useOutfitGenerator() {
  return useMutation({
    mutationFn: (request: OutfitRequest) => generateOutfit(request),
    retry: 1,
  });
}
