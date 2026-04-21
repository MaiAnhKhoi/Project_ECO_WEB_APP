import { httpClient } from "@/lib/httpClient";
import type { PromotionItem } from "@/types/promotion";

/**
 * Ưu đãi trang chủ — đặt route khi backend sẵn sàng, tạm thời có thể 404.
 * Ví dụ: GET /promotions/home
 */
export async function getHomePromotions(): Promise<PromotionItem[]> {
  return httpClient.get<PromotionItem[]>("/promotions/home");
}
