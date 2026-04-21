import api from "@/config/api";
import { BrandItem } from "@/types/brand";

const brandApi = {
  // Lấy danh sách brand
  getBrands() {
    return api.get<BrandItem[]>("/brands");
  },
};

export default brandApi;
