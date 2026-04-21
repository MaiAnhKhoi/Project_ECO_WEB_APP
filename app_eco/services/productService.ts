import { httpClient } from "@/lib/httpClient";
import type { Product } from "@/types/product";
import type { ProductPageResponse } from "@/types/product";
import type { ProductTabsResponse } from "@/types/productDetail";
import type { ShopFilters } from "@/types/filter";

const DEFAULT_LIMIT = 10;

export async function getBestSellers(limit: number = DEFAULT_LIMIT): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/best-sellers?limit=${limit}`);
}

export async function getBestDeals(limit: number = DEFAULT_LIMIT): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/best-deals?limit=${limit}`);
}

export async function getNewArrivals(limit: number = DEFAULT_LIMIT): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/new-arrivals?limit=${limit}`);
}

export async function getMostPopular(limit: number = DEFAULT_LIMIT): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/most-popular?limit=${limit}`);
}

export async function getTodaysPicks(limit: number = DEFAULT_LIMIT): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/todays-picks?limit=${limit}`);
}

export async function getFeaturedProducts(limit: number = 12): Promise<Product[]> {
  return httpClient.get<Product[]>(`/products/featured?limit=${limit}`);
}

export async function getProductDetail(productId: number): Promise<Product> {
  return httpClient.get<Product>(`/products/${productId}`);
}

export async function getProductTabs(productId: number): Promise<ProductTabsResponse> {
  return httpClient.get<ProductTabsResponse>(`/products/${productId}/details`);
}

export async function incrementProductViewCount(productId: number): Promise<void> {
  await httpClient.post<unknown>(`/products/${productId}/view`, {});
}

export async function getProductsByCategorySlug(
  slug: string,
  limit: number = 20
): Promise<Product[]> {
  return httpClient.get<Product[]>(
    `/products/by-category?slug=${encodeURIComponent(slug)}&limit=${limit}`
  );
}

export async function getProductsByBrandId(
  brandId: number,
  page: number = 0,
  size: number = 16
): Promise<ProductPageResponse> {
  return httpClient.get<ProductPageResponse>(
    `/products/filter?page=${page}&size=${size}&brandIds=${encodeURIComponent(
      String(brandId)
    )}`
  );
}

/** Lấy danh sách sản phẩm có lọc + phân trang — dùng cho màn Shop. */
export async function getShopProducts(
  page: number,
  size: number,
  filters: ShopFilters,
): Promise<ProductPageResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));

  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.availability === "inStock") params.set("inStock", "true");
  if (filters.availability === "outOfStock") params.set("inStock", "false");
  if (filters.color) params.append("colors", filters.color);
  if (filters.size) params.append("sizes", filters.size);
  /** Spring nhận `List<String> categories` — slug (khớp product hoặc parent category). */
  if (filters.categorySlug) {
    params.append("categories", filters.categorySlug);
  }
  if (filters.brandId !== null) params.append("brandIds", String(filters.brandId));

  if (filters.sort === "priceAsc") { params.set("sortBy", "basePrice"); params.set("sortDir", "asc"); }
  else if (filters.sort === "priceDesc") { params.set("sortBy", "basePrice"); params.set("sortDir", "desc"); }
  else if (filters.sort === "nameAsc") { params.set("sortBy", "name"); params.set("sortDir", "asc"); }
  else if (filters.sort === "nameDesc") { params.set("sortBy", "name"); params.set("sortDir", "desc"); }

  return httpClient.get<ProductPageResponse>(`/products/filter?${params.toString()}`);
}

export async function searchProducts(
  keyword: string,
  page: number = 0,
  size: number = 16,
  sortBy: string = "relevance"
): Promise<ProductPageResponse> {
  return httpClient.get<ProductPageResponse>(
    `/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}`
  );
}

