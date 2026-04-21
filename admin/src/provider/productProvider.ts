// src/provider/productProvider.ts
import productApi from "../service/productApi";
import type {
  ProductAdminDetailDto,
  ProductAdminPage,
} from "../type/product";
import { getPaginationFromUrl } from "../utils/pagination";

export const productProvider = {
  // ⚡ getList cho Refine (admin products)
  async getList(params: any) {
    const { pagination, filters } = params;

    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let keyword: string | undefined = undefined;
    let status: string | undefined = undefined;
    let brandId: number | undefined = undefined;

    // Refine filter format → backend params
    if (filters && Array.isArray(filters)) {
      filters.forEach((f: any) => {
        if (f.field === "keyword") keyword = f.value;
        if (f.field === "status") status = f.value;
        if (f.field === "brandId") brandId = Number(f.value);
      });
    }

    console.log(
      "🔥 productProvider.getList -> current =",
      current,
      "pageSize =",
      pageSize
    );

    const res = await productApi.getProductsAdmin({
      page: current - 1, // BE 0-based
      size: pageSize,
      keyword,
      status,
      brandId,
    });

    const wrapped = res.data as {
      success: boolean;
      data: ProductAdminPage;
    };

    const page: ProductAdminPage = wrapped.data;

    return {
      data: page.content,
      total: page.totalElements,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await productApi.getProductAdmin(id);
    const wrapped = res.data as {
      success: boolean;
      data: ProductAdminDetailDto;
    };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ create product (multipart/form-data)
  async create(params: any) {
    const { variables } = params;

    // EXPECT: variables là FormData
    const formData = variables as FormData;

    const res = await productApi.createProduct(formData);
    const wrapped = res.data as {
      success: boolean;
      data: ProductAdminDetailDto;
    };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update product (multipart/form-data)
  async update(params: any) {
    const { id, variables } = params;

    const formData = variables as FormData;

    const res = await productApi.updateProduct(id, formData);
    const wrapped = res.data as {
      success: boolean;
      data: ProductAdminDetailDto;
    };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete product
  async deleteOne(params: any) {
    const { id } = params;

    const res = await productApi.deleteProduct(id);
    const wrapped = res.data as {
      success: boolean;
      data: null;
    };

    return {
      data: wrapped.data,
    };
  },
};
