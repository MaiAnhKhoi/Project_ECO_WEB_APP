import api from "@/config/api";
import type {
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationSummary,
  OutfitRequest,
  OutfitResponse,
  PageResponse,
  ProductRecommendRequest,
  RecommendationHistory,
  RecommendationResponse,
  StyleAnalysisHistoryItem,
  StyleAnalysisResponse,
} from "../types";

interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

// ============================================================
// Chatbot
// ============================================================

export const sendChatMessage = async (req: ChatRequest): Promise<ChatResponse> => {
  const { data } = await api.post<ApiWrapper<ChatResponse>>("/ai/chat", req);
  return data.data;
};

export const fetchChatHistory = async (
  page = 0,
  size = 10
): Promise<PageResponse<ConversationSummary>> => {
  const { data } = await api.get<ApiWrapper<PageResponse<ConversationSummary>>>(
    `/ai/chat/history?page=${page}&size=${size}`
  );
  return data.data;
};

export const fetchConversation = async (id: number): Promise<ConversationDetail> => {
  const { data } = await api.get<ApiWrapper<ConversationDetail>>(
    `/ai/chat/conversation/${id}`
  );
  return data.data;
};

// ============================================================
// Outfit generator
// ============================================================

export const generateOutfit = async (req: OutfitRequest): Promise<OutfitResponse> => {
  const { data } = await api.post<ApiWrapper<OutfitResponse>>("/ai/recommend/outfit", req);
  return data.data;
};

// ============================================================
// Product recommendation
// ============================================================

export const fetchRecommendations = async (
  req: ProductRecommendRequest
): Promise<RecommendationResponse> => {
  const { data } = await api.post<ApiWrapper<RecommendationResponse>>(
    "/ai/recommend/products",
    req
  );
  return data.data;
};

export const fetchTrending = async (limit = 10): Promise<RecommendationResponse> => {
  const { data } = await api.get<ApiWrapper<RecommendationResponse>>(
    `/ai/recommend/trending?limit=${limit}`
  );
  return data.data;
};

// ============================================================
// Behavior tracking (fire-and-forget)
// ============================================================

// ============================================================
// Style Analysis
// ============================================================

export const analyzeStyle = async (
  image: File,
  userId?: number
): Promise<StyleAnalysisResponse> => {
  const formData = new FormData();
  formData.append("image", image);
  if (userId) formData.append("userId", String(userId));

  const { data } = await api.post<ApiWrapper<StyleAnalysisResponse>>(
    "/ai/style-analysis",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
};

// ============================================================
// AI History
// ============================================================

export const fetchStyleHistory = async (
  page = 0,
  size = 10
): Promise<PageResponse<StyleAnalysisHistoryItem>> => {
  const { data } = await api.get<ApiWrapper<PageResponse<StyleAnalysisHistoryItem>>>(
    `/ai/history/style-analysis?page=${page}&size=${size}`
  );
  return data.data;
};

export const fetchStyleHistoryDetail = async (
  historyId: number
): Promise<StyleAnalysisHistoryItem> => {
  const { data } = await api.get<ApiWrapper<StyleAnalysisHistoryItem>>(
    `/ai/history/style-analysis/${historyId}`
  );
  return data.data;
};

export const fetchOutfitHistory = async (
  page = 0,
  size = 10
): Promise<PageResponse<RecommendationHistory>> => {
  const { data } = await api.get<ApiWrapper<PageResponse<RecommendationHistory>>>(
    `/ai/history/outfits?page=${page}&size=${size}`
  );
  return data.data;
};

export const fetchOutfitHistoryDetail = async (logId: number): Promise<OutfitResponse> => {
  const { data } = await api.get<ApiWrapper<OutfitResponse>>(
    `/ai/history/outfits/${logId}`
  );
  return data.data;
};

export const fetchRecommendationHistory = async (
  page = 0,
  size = 10
): Promise<PageResponse<RecommendationHistory>> => {
  const { data } = await api.get<ApiWrapper<PageResponse<RecommendationHistory>>>(
    `/ai/history/recommendations?page=${page}&size=${size}`
  );
  return data.data;
};

export const trackBehavior = (params: {
  productId?: number;
  categoryId?: number;
  brandId?: number;
  behaviorType: string;
  sessionId?: string;
}) => {
  const query = new URLSearchParams();
  if (params.productId) query.set("productId", String(params.productId));
  if (params.categoryId) query.set("categoryId", String(params.categoryId));
  if (params.brandId) query.set("brandId", String(params.brandId));
  if (params.sessionId) query.set("sessionId", params.sessionId);
  query.set("behaviorType", params.behaviorType);

  api.post(`/ai/behavior/track?${query.toString()}`).catch(() => {
    // intentionally silent — behavior tracking is non-critical
  });
};
