// src/provider/categoryProvider.ts
import categoryApi from "../service/categoryApi";
import type { Category, CategoryPage } from "../type/category";
import { getPaginationFromUrl } from "../utils/pagination";

export const categoryProvider = {
  // ⚡ getList cho Refine (admin categories)
  async getList(params: any) {
    const { pagination } = params;

    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    // BE: GET /api/admin/categories?page=&size=
    const res = await categoryApi.getCategoriesAdmin(
      current - 1, // 0-based cho backend
      pageSize
    );

    const wrapped = res.data as { success: boolean; data: CategoryPage } | CategoryPage;

    const page: CategoryPage =
      (wrapped as any).data?.content !== undefined
        ? (wrapped as any).data
        : (wrapped as any);

    return {
      data: page.content ?? [],
      total: page.totalElements ?? 0,
    };
  },


  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await categoryApi.getCategory(id);
    const wrapped = res.data as { success: boolean; data: Category };
    const category: Category = wrapped.data;

    return {
      data: category,
    };
  },

  // ⚡ create category (multipart/form-data)
  async create(params: any) {
    const { variables } = params;

    // EXPECT: variables là FormData
    const formData = variables as FormData;

    const res = await categoryApi.createCategory(formData);
    const wrapped = res.data as { success: boolean; data: Category };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update category (multipart/form-data)
  async update(params: any) {
    const { id, variables } = params;

    const formData = variables as FormData;

    const res = await categoryApi.updateCategory(id, formData);
    const wrapped = res.data as { success: boolean; data: Category };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete category
  async deleteOne(params: any) {
    const { id } = params;

    const res = await categoryApi.deleteCategory(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};
