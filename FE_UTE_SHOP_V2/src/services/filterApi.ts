import api from "@/config/api";
import { FilterResponse } from "@/types/filter";

const filterApi = {
  // Lấy toàn bộ filter cho trang sản phẩm
  getGlobalFilters() {
    return api.get<FilterResponse>("/filters");
  },
};

export default filterApi;
