import contactMessageApi from "../service/contactMessageApi";
import { getPaginationFromUrl } from "../utils/pagination";

export const contactMessageProvider = {
  async getList(params: any) {
    const { pagination, filters } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);
    const statusFilter = Array.isArray(filters)
      ? filters.find((f) => f.field === "status")
      : undefined;
    const status = (statusFilter as any)?.value ?? filters?.status;
    const keyword = filters?.q?.value ?? filters?.q;

    const res = await contactMessageApi.list({
      page: current - 1,
      size: pageSize,
      status,
      keyword,
    });

    const data = res.data.data;

    return {
      data: data.content,
      total: data.totalElements,
    };
  },

  async getOne(params: any) {
    const { id } = params;
    const res = await contactMessageApi.getById(id);
    return {
      data: res.data.data,
    };
  },

  async update(params: any) {
    const { id, variables } = params;
    const res = await contactMessageApi.updateStatus(id, variables.status, variables.note);
    return {
      data: res.data.data,
    };
  },
};

