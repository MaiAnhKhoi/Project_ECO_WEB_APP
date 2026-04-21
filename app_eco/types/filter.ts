// ─── Response từ GET /filters ──────────────────────────────────────────────

export interface FilterCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface FilterColor {
  id: number;
  name: string;
  count: number;
  cssClass?: string | null;
  hex?: string | null;
}

export interface FilterSize {
  size: string;
  count: number;
}

export interface FilterBrand {
  id: number;
  name: string;
  count: number;
}

export interface FilterResponse {
  price: { min: number; max: number };
  availability: { inStock: number; outOfStock: number };
  categories: FilterCategory[];
  colors: FilterColor[];
  sizes: FilterSize[];
  brands: FilterBrand[];
}

// ─── Trạng thái bộ lọc trong app ─────────────────────────────────────────────

export type SortOption = "default" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";
export type AvailabilityFilter = "all" | "inStock" | "outOfStock";

export interface ShopFilters {
  sort: SortOption;
  availability: AvailabilityFilter;
  /** null = không giới hạn */
  minPrice: number | null;
  maxPrice: number | null;
  /** tên màu (từ FilterColor.name) */
  color: string | null;
  /** giá trị kích thước (từ FilterSize.size) */
  size: string | null;
  /** id thương hiệu */
  brandId: number | null;
  /** slug danh mục */
  categorySlug: string | null;
}

export const SHOP_DEFAULT_FILTERS: ShopFilters = {
  sort: "default",
  availability: "all",
  minPrice: null,
  maxPrice: null,
  color: null,
  size: null,
  brandId: null,
  categorySlug: null,
};

/** Trả về true nếu có ít nhất một bộ lọc đang bật */
export function shopFiltersActive(f: ShopFilters, globalMin: number, globalMax: number): boolean {
  return (
    f.sort !== "default" ||
    f.availability !== "all" ||
    (f.minPrice !== null && f.minPrice > globalMin) ||
    (f.maxPrice !== null && f.maxPrice < globalMax) ||
    f.color !== null ||
    f.size !== null ||
    f.brandId !== null ||
    f.categorySlug !== null
  );
}
