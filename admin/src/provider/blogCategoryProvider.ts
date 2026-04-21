// src/provider/blogCategoryProvider.ts
import blogCategoryApi from "../service/blogCategoryApi";
import type { BlogCategory } from "../service/blogCategoryApi";

export const blogCategoryProvider = {
  // ⚡ getList cho Refine (admin blog categories)
  async getList(_params: any) {
    const res = await blogCategoryApi.getBlogCategories();

    const wrapped = res.data as {
      success: boolean;
      data: BlogCategory[];
    };

    const categories: BlogCategory[] = wrapped.data;

    return {
      data: categories,
      total: categories.length,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await blogCategoryApi.getBlogCategory(id);
    const wrapped = res.data as { success: boolean; data: BlogCategory };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ create blog category
  async create(params: any) {
    const { variables } = params;

    const res = await blogCategoryApi.createBlogCategory(variables);
    const wrapped = res.data as { success: boolean; data: BlogCategory };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update blog category
  async update(params: any) {
    const { id, variables } = params;

    const res = await blogCategoryApi.updateBlogCategory(id, variables);
    const wrapped = res.data as { success: boolean; data: BlogCategory };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete blog category
  async deleteOne(params: any) {
    const { id } = params;

    const res = await blogCategoryApi.deleteBlogCategory(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};

