import { httpClient } from "@/lib/httpClient";
import type { CategoryItem } from "@/types/category";

/** GET /categories/roots */
export async function getRootCategories(): Promise<CategoryItem[]> {
  return httpClient.get<CategoryItem[]>("/categories/roots");
}

/** GET /categories?parent_id= */
export async function getCategoriesByParentId(
  parentId: number
): Promise<CategoryItem[]> {
  return httpClient.get<CategoryItem[]>(`/categories?parent_id=${parentId}`);
}
