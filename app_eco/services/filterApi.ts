import { httpClient } from "@/lib/httpClient";
import type { FilterResponse } from "@/types/filter";

export const filterApi = {
  /** Lấy toàn bộ metadata bộ lọc cho trang sản phẩm. */
  getGlobalFilters: () => httpClient.get<FilterResponse>("/filters"),
};
