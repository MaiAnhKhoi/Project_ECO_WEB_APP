import reviewAdminApi from "../service/reviewAdminApi";
import type { ReviewAdminDto } from "../type/review";
import { getPaginationFromUrl } from "../utils/pagination";

export const reviewProvider = {
  async getList(params: any) {
    const { pagination, filters } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    const statusFilter = Array.isArray(filters)
      ? filters.find((f) => f.field === "status")
      : undefined;
    const status = (statusFilter as any)?.value ?? filters?.status;
    const keyword = filters?.q?.value ?? filters?.q;

    const response = await reviewAdminApi.list({
      page: current - 1,
      size: pageSize,
      productId: filters?.productId,
      rating: filters?.rating,
      status,
      keyword,
    });

    const data = response.data.data;

    return {
      data: data.content,
      total: data.totalElements,
    };
  },

  async getOne(params: any) {
    const { id } = params;
    const response = await reviewAdminApi.getById(id);
    return {
      data: response.data.data,
    };
  },

  async update(params: any) {
    const { id, variables } = params;
    const response = await reviewAdminApi.updateStatus(id, variables.status);
    return {
      data: response.data.data,
    };
  },
};

