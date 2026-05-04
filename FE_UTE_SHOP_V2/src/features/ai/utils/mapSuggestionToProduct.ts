import type { Product } from "@/types/product";
import type { ProductSuggestion } from "../types";

const PLACEHOLDER = "/images/placeholder.jpg";

/** Map gợi ý AI → Product cho ProductCard (trang chủ). */
export function mapSuggestionToProduct(s: ProductSuggestion): Product {
  const img = s.imageUrl?.trim() || PLACEHOLDER;
  return {
    id: s.id,
    title: s.name,
    imgSrc: img,
    imgHover: img,
    price: s.price,
    oldPrice: s.originalPrice ?? null,
    isTrending: true,
  };
}
