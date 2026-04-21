/**
 * Thẻ ưu đãi / bulk deal (mở rộng; endpoint có thể bổ sung sau).
 */
export interface PromotionItem {
  id: number | string;
  name: string;
  imageUrl: string;
  price?: number | null;
  promotionText: string;
}
