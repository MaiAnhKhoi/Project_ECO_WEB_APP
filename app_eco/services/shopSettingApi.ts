import { httpClient } from "@/lib/httpClient";

export type ShopSettingResponse = {
  shopName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  mapIframe: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  snapchatUrl: string;
};

export const shopSettingApi = {
  getShopSettings: () => httpClient.get<ShopSettingResponse>("/contact-info"),
};

