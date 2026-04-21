import api from "@/config/api";
import { BannerItem } from "@/types/banner";

const bannersApi = {
  // Home banner slider
  getHomeBanners() {
    return api.get<BannerItem[]>("/banners/home");
  },
};

export default bannersApi;
