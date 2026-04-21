import axiosAdmin from "./axiosAdmin";
import type { ReviewAdminDto, ReviewAdminPageResponse } from "../type/review";

export interface ReviewQueryParams {
  page?: number;
  size?: number;
  productId?: number;
  rating?: number;
  status?: string;
  keyword?: string;
}

const reviewAdminApi = {
  list(params: ReviewQueryParams) {
    return axiosAdmin.get<{ success: boolean; data: ReviewAdminPageResponse }>(
      "/admin/reviews",
      { params }
    );
  },

  getById(id: number) {
    return axiosAdmin.get<{ success: boolean; data: ReviewAdminDto }>(
      `/admin/reviews/${id}`
    );
  },

  updateStatus(id: number, status: string) {
    return axiosAdmin.put<{ success: boolean; data: ReviewAdminDto }>(
      `/admin/reviews/${id}/status`,
      { status }
    );
  },
};

export default reviewAdminApi;

