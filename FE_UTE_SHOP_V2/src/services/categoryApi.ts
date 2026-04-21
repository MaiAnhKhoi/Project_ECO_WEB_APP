import api from "@/config/api";
import { CategoryItem } from "@/types/category";

const categoryApi = {
  /**
   * GET /api/categories/roots
   * -> Lấy danh sách category cha (Men, Women, Giày...)
   */
  getRootCategories() {
    return api.get<CategoryItem[]>("/categories/roots");
  },

  /**
   * GET /api/categories?parent_id=xxx
   * -> Lấy danh sách category con dựa vào parent_id
   */
  getChildrenByParentId(parentId: number) {
    return api.get<CategoryItem[]>(`/categories`, {
      params: { parent_id: parentId },
    });
  },

  /**
   * GET /api/categories/{slug}/children
   * -> Lấy danh sách category con dựa vào slug cha
   */
  getChildrenBySlug(slug: string) {
    return api.get<CategoryItem[]>(`/categories/${slug}/children`);
  },
};

export default categoryApi;
