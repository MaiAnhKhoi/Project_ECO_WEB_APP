// src/api/productApi.ts
import axiosAdmin from "./axiosAdmin";
import type {
  ApiResponse,
  ProductCard,
  ProductDetail,
  ProductAdminDetailDto,
  ProductAdminPage,
  ProductVariantAdminDto,
} from "../type/product";

const productApi = {
  // ===============================
  //             PUBLIC
  // ===============================

  // 📌 Client: lấy danh sách sản phẩm (có phân trang)
  getProducts(page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<ProductCard[]>>(`/products`, {
      params: { page, size },
    });
  },

  // 📌 Client: chi tiết sản phẩm theo id
  getProductDetail(id: number) {
    return axiosAdmin.get<ApiResponse<ProductDetail>>(`/products/${id}`);
  },

  // 📌 (optional) search sản phẩm (nếu backend có /products/search)
  searchProducts(params: {
    keyword: string;
    page?: number;
    size?: number;
    sortBy?: string;
  }) {
    const { page = 0, size = 20, ...rest } = params;
    return axiosAdmin.get<ApiResponse<ProductCard[]>>(`/products/search`, {
      params: { page, size, ...rest },
    });
  },

  // ===============================
  //             ADMIN
  // ===============================

  // 📌 List products admin (paging + filter đơn giản)
  getProductsAdmin(options: {
    page?: number;
    size?: number;
    keyword?: string;
    status?: string;
    brandId?: number;
  }) {
    const { page = 0, size = 20, keyword, status, brandId } = options;
    return axiosAdmin.get<ApiResponse<ProductAdminPage>>(`/admin/products`, {
      params: { page, size, keyword, status, brandId },
    });
  },

  // 📌 Lấy chi tiết product admin
  getProductAdmin(id: number) {
    return axiosAdmin.get<ApiResponse<ProductAdminDetailDto>>(
      `/admin/products/${id}`
    );
  },

  // 📌 Tạo product (có upload ảnh)
  // FormData gồm:
  //  - data: JSON string của CreateProductRequest
  //  - images: các file ảnh
  createProduct(data: FormData) {
    return axiosAdmin.post<ApiResponse<ProductAdminDetailDto>>(
      `/admin/products`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Update product (có thể kèm ảnh mới)
  updateProduct(id: number, data: FormData) {
    return axiosAdmin.put<ApiResponse<ProductAdminDetailDto>>(
      `/admin/products/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Xoá product (soft delete)
  deleteProduct(id: number) {
    return axiosAdmin.delete<ApiResponse<null>>(`/admin/products/${id}`);
  },

  // 📌 Xoá product image
  deleteProductImage(productId: number, imageId: number) {
    return axiosAdmin.delete<ApiResponse<null>>(
      `/admin/products/${productId}/images/${imageId}`
    );
  },

  // ===============================
  //             VARIANTS (ADMIN)
  // ===============================

  // 📌 Tạo variant cho product (kèm ảnh)
  // FormData:
  //  - data: JSON CreateVariantRequest
  //  - images: files ảnh
  createVariant(productId: number, data: FormData) {
    return axiosAdmin.post<ApiResponse<ProductVariantAdminDto>>(
      `/admin/products/${productId}/variants`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Update variant (kèm ảnh mới)
  updateVariant(productId: number, variantId: number, data: FormData) {
    return axiosAdmin.put<ApiResponse<ProductVariantAdminDto>>(
      `/admin/products/${productId}/variants/${variantId}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // 📌 Xoá variant
  deleteVariant(productId: number, variantId: number) {
    return axiosAdmin.delete<ApiResponse<null>>(
      `/admin/products/${productId}/variants/${variantId}`
    );
  }

  ,

  // 📌 Update stock của variant
  updateVariantStock(
    productId: number,
    variantId: number,
    payload: {
      quantity?: number;
      safetyStock?: number;
      location?: string;
    }
  ) {
    return axiosAdmin.patch<ApiResponse<ProductVariantAdminDto>>(
      `/admin/products/${productId}/variants/${variantId}/stock`,
      payload
    );
  },

  // 📌 Xoá variant image
  deleteVariantImage(variantId: number, imageId: number) {
    return axiosAdmin.delete<ApiResponse<null>>(
      `/admin/products/variants/${variantId}/images/${imageId}`
    );
  },
};

export default productApi;
