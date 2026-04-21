import api from "@/config/api";

export interface TryOnRequest {
  productId: number;
  variantId: number | null;
  category: "upper_body" | "lower_body" | "dresses";
  modelImageUrl: string;
  garmentImageUrl: string;
}

export interface TryOnHistoryItem {
  id: number;
  productId: number;
  variantId: number | null;
  category: string;
  modelImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const virtualTryOnApi = {
  // ⚡ Thử đồ ảo — timeout dài 10 phút
  async tryOn(payload: TryOnRequest): Promise<TryOnHistoryItem> {
    const res = await api.post<ApiResponse<TryOnHistoryItem>>(
      "/virtual-tryon",
      payload,
      {
        timeout: 600000, // ⏱️ 10 phút
      }
    );
    return res.data.data;
  },

  // Lấy lịch sử — không cần timeout dài
  async getHistory(productId: number): Promise<TryOnHistoryItem[]> {
    const res = await api.get<ApiResponse<TryOnHistoryItem[]>>(
      "/virtual-tryon/history",
      {
        params: { productId },
      }
    );
    return res.data.data;
  },
};

export default virtualTryOnApi;
