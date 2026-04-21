import type { PageResponse } from "./productPage";

export interface ProductVariantSize {
  size: string;
  inStock: boolean;
  variantId: number;
  stockQuantity: number;
}

export interface ProductColor {
  label: string;
  value?: string | null; // ví dụ: bg-white
  img?: string | null;
  colorHex?: string | null;
  colorCssClass?: string | null;
  hex?: string | null; // fallback cho BE cũ
  sizes?: ProductVariantSize[];
}

export interface Product {
  id: number;
  imgSrc: string;
  imgHover?: string | null;
  width?: number;
  height?: number;
  saleLabel?: string | null;
  title: string;
  price: number;
  oldPrice?: number | null;
  colors?: ProductColor[] | null;
  inStock?: boolean;
  /** Thương hiệu (BE có thể trả filterBrands). */
  filterBrands?: string[];
  sold?: number;
  stockProgress?: number;
  stockProgressPercent?: number;
}

export type ProductPageResponse = PageResponse<Product>;

