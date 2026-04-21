// src/providers/brandProvider.ts
import brandApi from "../service/brandApi";
import type { Brand, BrandPage } from "../type/brand";
import { getPaginationFromUrl } from "../utils/pagination";

export const brandProvider = {
  // ⚡ getList cho Refine (admin brands)
  async getList(params: any) {
    const { pagination } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    // BE: GET /api/admin/brands?page=&size=
    const res = await brandApi.getBrandsAdmin(current - 1, pageSize);

    // API: { success, data: { content, totalElements, ... } }
    const wrapped = res.data as { success: boolean; data: BrandPage };
    const page: BrandPage = wrapped.data;

    return {
      data: page.content,
      total: page.totalElements,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await brandApi.getBrand(id);
    const wrapped = res.data as { success: boolean; data: Brand };
    const brand: Brand = wrapped.data;

    return {
      data: brand,
    };
  },

  // ⚡ create brand (multipart/form-data)
  async create(params: any) {
    const { variables } = params;

    // ⚠️ Ở đây EXPECT variables là FormData
    // Bạn tạo FormData bên form rồi truyền thẳng vào dataProvider.create
    const formData = variables as FormData;

    const res = await brandApi.createBrand(formData);
    const wrapped = res.data as { success: boolean; data: Brand };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update brand (multipart/form-data)
  async update(params: any) {
    const { id, variables } = params;

    const formData = variables as FormData;

    const res = await brandApi.updateBrand(id, formData);
    const wrapped = res.data as { success: boolean; data: Brand };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete brand
  async deleteOne(params: any) {
    const { id } = params;

    const res = await brandApi.deleteBrand(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};
