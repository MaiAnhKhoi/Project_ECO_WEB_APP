import { httpClient } from "@/lib/httpClient";
import type { Brand } from "@/types/brand";

/** GET /brands */
export async function getAllBrands(): Promise<Brand[]> {
  return httpClient.get<Brand[]>("/brands");
}

