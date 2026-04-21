import api from "@/config/api";

export interface ShopSettingResponse {
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
}

const shopSettingApi = {
  // Lấy thông tin liên hệ + social + map + logo
  getShopSettings() {
    return api.get<ShopSettingResponse>("/contact-info");
  },
};

export default shopSettingApi;
