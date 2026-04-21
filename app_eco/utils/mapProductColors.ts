import type { Product, ProductColor, ProductVariantSize } from "@/types/product";
import { resolveColorHexFlexible } from "@/utils/color";

/** Chuẩn hóa màu + size biến thể từ API (cùng logic với web `Details.tsx`). */
export function mapProductColorsFromApi(product: Product): ProductColor[] {
  const raw = product.colors;
  if (!raw || raw.length === 0) return [];

  return raw.map((c: any) => {
    const label = c.label || c.name || "";
    const cssClass = c.value || c.colorCssClass || null;
    const img = c.img || c.imageSrc || null;
    const hex = resolveColorHexFlexible({
      hex: c.colorHex || c.hex || null,
      cssClass,
      fallbackName: label,
    });

    const sizes: ProductVariantSize[] = (c.sizes || []).map((s: any) => ({
      size: s.size || s.label || "",
      inStock: s.inStock ?? false,
      variantId: s.variantId || 0,
      stockQuantity: s.stockQuantity || 0,
    }));

    return {
      label,
      value: cssClass,
      img,
      colorHex: hex,
      colorCssClass: cssClass,
      hex,
      sizes,
    };
  });
}
