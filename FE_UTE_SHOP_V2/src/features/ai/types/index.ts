// ============================================================
// AI Feature — TypeScript types
// Mirrors backend DTOs exactly
// ============================================================

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

export type ChatStatus = "idle" | "loading" | "error" | "success";
