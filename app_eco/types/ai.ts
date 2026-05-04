/**
 * DTO AI — khớp BE và FE_UTE_SHOP_V2/src/features/ai/types
 */

export interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  originalPrice: number | null;
  reason?: string;
  matchScore?: number;
}

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
  tokensUsed?: number;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  conversationId?: number;
}

export interface ChatResponse {
  conversationId: number;
  sessionId: string;
  reply: string;
  suggestedProducts: ProductSuggestion[];
  tokensUsed: number;
  fromCache: boolean;
}

export interface OutfitItem {
  productId: number;
  productName: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  category?: string;
  role: string;
}

export interface Outfit {
  outfitNumber: number;
  name: string;
  description: string;
  occasion: string;
  style: string;
  items: OutfitItem[];
  totalPrice: number;
}

export interface OutfitResponse {
  originalPrompt: string;
  outfits: Outfit[];
  tokensUsed: number;
  fromCache: boolean;
  logId?: number;
}

export interface OutfitRequest {
  prompt: string;
  sessionId?: string;
}

export interface RecommendationResponse {
  products: ProductSuggestion[];
  recommendationReason?: string;
  fromCache: boolean;
  logId?: number;
}

export interface ProductRecommendRequest {
  prompt?: string;
  viewedProductIds?: number[];
  sessionId?: string;
  limit?: number;
}

export interface ConversationSummary {
  conversationId: number;
  sessionId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ChatMessage[];
}

export interface AIBehaviorTrackParams {
  productId?: number;
  categoryId?: number;
  brandId?: number;
  behaviorType: string;
  sessionId?: string;
}

// ============================================================
// AI Style Analysis
// ============================================================

export type Gender = "MALE" | "FEMALE" | "UNISEX" | "UNKNOWN";

export interface StyleAnalysisResponse {
 gender: Gender;
 bodyType: string;
 skinTone: string;
 recommendedStyle: string;
 confidenceScore: number;
 analyzedImageUrl: string;
 /** true when AI is unsure about gender */
 needsGenderConfirmation: boolean;
 products: ProductSuggestion[];
 fromCache: boolean;
 profileId?: number;
}

// ============================================================
// AI History (BE: StyleAnalysisHistoryDto, RecommendationHistoryDto)
// ============================================================

export interface StyleAnalysisHistoryItem {
  id: number;
  imageUrl: string;
  bodyType: string;
  skinTone: string;
  recommendedStyle: string;
  gender: Gender | null;
  confidenceScore?: number | null;
  needsGenderConfirmation?: boolean | null;
  createdAt: string;
  products: ProductSuggestion[];
}

export interface RecommendationHistory {
  id: number;
  type: string;
  userPrompt: string | null;
  tokensUsed: number | null;
  cacheHit: boolean;
  createdAt: string;
}
