import { httpClient } from "@/lib/httpClient";
import type {
  AIBehaviorTrackParams,
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationSummary,
  OutfitRequest,
  OutfitResponse,
  ProductRecommendRequest,
  RecommendationResponse,
} from "@/types/ai";
import type { PageResponse } from "@/types/productPage";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
};

export async function sendAIChat(req: ChatRequest): Promise<ChatResponse> {
  const res = await httpClient.post<ApiWrapper<ChatResponse>>("/ai/chat", req);
  return res.data;
}

export async function fetchAIChatHistory(
  page = 0,
  size = 10
): Promise<PageResponse<ConversationSummary>> {
  const res = await httpClient.get<ApiWrapper<PageResponse<ConversationSummary>>>(
    `/ai/chat/history?page=${page}&size=${size}`
  );
  return res.data;
}

export async function fetchAIConversation(id: number): Promise<ConversationDetail> {
  const res = await httpClient.get<ApiWrapper<ConversationDetail>>(
    `/ai/chat/conversation/${id}`
  );
  return res.data;
}

export async function generateOutfit(req: OutfitRequest): Promise<OutfitResponse> {
  const res = await httpClient.post<ApiWrapper<OutfitResponse>>(
    "/ai/recommend/outfit",
    req
  );
  return res.data;
}

export async function fetchAIRecommendations(
  req: ProductRecommendRequest
): Promise<RecommendationResponse> {
  const res = await httpClient.post<ApiWrapper<RecommendationResponse>>(
    "/ai/recommend/products",
    req
  );
  return res.data;
}

export async function fetchAITrending(limit = 10): Promise<RecommendationResponse> {
  const res = await httpClient.get<ApiWrapper<RecommendationResponse>>(
    `/ai/recommend/trending?limit=${limit}`
  );
  return res.data;
}

export function trackAIBehavior(params: AIBehaviorTrackParams): void {
  const query = new URLSearchParams();
  if (params.productId) query.set("productId", String(params.productId));
  if (params.categoryId) query.set("categoryId", String(params.categoryId));
  if (params.brandId) query.set("brandId", String(params.brandId));
  if (params.sessionId) query.set("sessionId", params.sessionId);
  query.set("behaviorType", params.behaviorType);

  httpClient.post(`/ai/behavior/track?${query.toString()}`).catch(() => {
    // intentionally silent — non-critical
  });
}
