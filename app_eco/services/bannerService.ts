import { httpClient } from "@/lib/httpClient";
import type { BannerItem } from "@/types/banner";

/** GET /banners/home — cùng route với FE `bannerApi.getHomeBanners` */
export async function getHomeBanners(): Promise<BannerItem[]> {
  return httpClient.get<BannerItem[]>("/banners/home");
}
