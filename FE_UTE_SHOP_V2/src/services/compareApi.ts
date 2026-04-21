import api from "@/config/api";
import { Product } from "@/types/product";

export interface CompareResponse {
  comparisonId: number | null;
  comparisonName: string | null;
  products: Product[];
  totalItems: number;
}

const compareApi = {
  // Lấy danh sách sản phẩm so sánh
  getMyCompare() {
    return api.get<{ success: boolean; data: CompareResponse }>("/compare/my");
  },

  // Thêm sản phẩm vào danh sách so sánh
  addProduct(productId: number) {
    return api.post<{ success: boolean; data: CompareResponse; message?: string }>(
      `/compare/products/${productId}`
    );
  },

  // Xóa sản phẩm khỏi danh sách so sánh
  removeProduct(productId: number) {
    return api.delete<{ success: boolean; data: CompareResponse; message?: string }>(
      `/compare/products/${productId}`
    );
  },

  // Xóa tất cả sản phẩm khỏi danh sách so sánh
  clearAll() {
    return api.delete<{ success: boolean; data: CompareResponse; message?: string }>(
      "/compare/clear"
    );
  },
};

export default compareApi;

