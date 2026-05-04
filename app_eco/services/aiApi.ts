import { httpClient } from "@/lib/httpClient";
import { useAuthStore } from "@/store/authStore";
import type {
  AIBehaviorTrackParams,
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationSummary,
  OutfitRequest,
  OutfitResponse,
  ProductRecommendRequest,
  RecommendationHistory,
  RecommendationResponse,
  StyleAnalysisHistoryItem,
  StyleAnalysisResponse,
} from "@/types/ai";
import type { PageResponse } from "@/types/productPage";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
};

/** Lịch sử AI yêu cầu Bearer token (đồng bộ với AiController). */
function requireAiAuthToken(): string {
  const t = useAuthStore.getState().accessToken;
  if (!t) {
    throw new Error("Vui lòng đăng nhập để xem lịch sử AI.");
  }
  return t;
}

export async function sendAIChat(req: ChatRequest): Promise<ChatResponse> {
  const res = await httpClient.post<ApiWrapper<ChatResponse>>("/ai/chat", req);
  return res.data;
}

export async function fetchAIChatHistory(
  page = 0,
  size = 10
): Promise<PageResponse<ConversationSummary>> {
  const token = requireAiAuthToken();
  const res = await httpClient.get<ApiWrapper<PageResponse<ConversationSummary>>>(
    `/ai/chat/history?page=${page}&size=${size}`,
    { token }
  );
  return res.data;
}

export async function fetchAIConversation(id: number): Promise<ConversationDetail> {
  const token = useAuthStore.getState().accessToken;
  const res = await httpClient.get<ApiWrapper<ConversationDetail>>(
    `/ai/chat/conversation/${id}`,
    token ? { token } : undefined
  );
  return res.data;
}

export async function generateOutfit(req: OutfitRequest): Promise<OutfitResponse> {
  /** Cần Bearer để BE gắn userId vào log — lịch sử outfit chỉ theo user đã đăng nhập. */
  const token = useAuthStore.getState().accessToken;
  const res = await httpClient.post<ApiWrapper<OutfitResponse>>(
    "/ai/recommend/outfit",
    req,
    token ? { token } : undefined
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

// ============================================================
// Style Analysis
// ============================================================

export async function analyzeStyle(
  imageUri: string,
  token?: string | null,
  userId?: number
): Promise<StyleAnalysisResponse> {
  const form = new FormData();

  // React Native FormData file object
  form.append("image", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  if (userId) {
    form.append("userId", String(userId));
  }

  const res = await httpClient.postMultipart<ApiWrapper<StyleAnalysisResponse>>(
    "/ai/style-analysis",
    form,
    token
  );
  return res.data;
}

// ============================================================
// AI History
// ============================================================

export async function fetchAIStyleHistory(
  page = 0,
  size = 10
): Promise<PageResponse<StyleAnalysisHistoryItem>> {
  const token = requireAiAuthToken();
  const res = await httpClient.get<ApiWrapper<PageResponse<StyleAnalysisHistoryItem>>>(
    `/ai/history/style-analysis?page=${page}&size=${size}`,
    { token }
  );
  return res.data;
}

export async function fetchAIStyleHistoryDetail(
  id: number
): Promise<StyleAnalysisHistoryItem> {
  const token = requireAiAuthToken();
  const res = await httpClient.get<ApiWrapper<StyleAnalysisHistoryItem>>(
    `/ai/history/style-analysis/${id}`,
    { token }
  );
  return res.data;
}

export async function fetchAIOutfitHistory(
  page = 0,
  size = 10
): Promise<PageResponse<RecommendationHistory>> {
  const token = requireAiAuthToken();
  const res = await httpClient.get<ApiWrapper<PageResponse<RecommendationHistory>>>(
    `/ai/history/outfits?page=${page}&size=${size}`,
    { token }
  );
  return res.data;
}

export async function fetchAIOutfitHistoryDetail(logId: number): Promise<OutfitResponse> {
  const token = requireAiAuthToken();
  const res = await httpClient.get<ApiWrapper<OutfitResponse>>(
    `/ai/history/outfits/${logId}`,
    { token }
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
