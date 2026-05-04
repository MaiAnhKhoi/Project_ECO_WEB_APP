import type { ProductSuggestion } from "@/types/ai";
import type { Product } from "@/types/product";

/** Chuyển DTO gợi ý AI → Product cho ProductCardSmall / ProductSection. */
export function productSuggestionToProduct(s: ProductSuggestion): Product {
  return {
    id: s.id,
    imgSrc: s.imageUrl ?? "",
    title: s.name,
    price: s.price,
    oldPrice: s.originalPrice,
  };
}
