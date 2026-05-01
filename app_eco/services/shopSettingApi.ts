import { httpClient } from "@/lib/httpClient";
import type { ShopSettingResponse } from "@/types/contact";

export const shopSettingApi = {
  getShopSettings: () => httpClient.get<ShopSettingResponse>("/contact-info"),
};
