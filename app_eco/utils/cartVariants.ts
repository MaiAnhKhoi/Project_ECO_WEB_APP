import type { CartVariantOption } from "@/types/cart";
import type { Product } from "@/types/product";

/** Gom màu × size thành danh sách biến thể (giống web) để đổi trong giỏ. */
export function variantOptionsFromProduct(product: Product): CartVariantOption[] {
  const colors = product.colors ?? [];
  if (colors.length === 0) return [];

  const options: CartVariantOption[] = [];
  for (const c of colors) {
    for (const s of c.sizes ?? []) {
      options.push({
        variantId: s.variantId,
        color: c.label,
        size: s.size,
        price: product.price,
        maxQuantity: Math.max(0, s.stockQuantity ?? 0),
        imageUrl: c.img ?? product.imgSrc ?? null,
      });
    }
  }
  return options;
}
