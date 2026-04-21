// src/provider/blogProvider.ts
import blogApi from "../service/blogApi";
import type { BlogResponse, BlogPage } from "../service/blogApi";
import { getPaginationFromUrl } from "../utils/pagination";

export const blogProvider = {
  // ⚡ getList cho Refine (admin blog posts)
  async getList(params: any) {
    const { pagination, filters } = params;

    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let keyword: string | undefined = undefined;
    let status: string | undefined = undefined;
    let categoryId: number | undefined = undefined;

    // Refine filter format → backend params
    if (filters && Array.isArray(filters)) {
      filters.forEach((f: any) => {
        if (f.field === "keyword") keyword = f.value;
        if (f.field === "status") status = f.value;
        if (f.field === "categoryId") categoryId = Number(f.value);
      });
    }

    console.log(
      "🔥 blogProvider.getList -> current =",
      current,
      "pageSize =",
      pageSize
    );

    const res = await blogApi.getBlogsAdmin(
      current - 1, // BE 0-based
      pageSize,
      keyword,
      status,
      categoryId
    );

    const wrapped = res.data as {
      success: boolean;
      data: BlogPage;
    };

    const page: BlogPage = wrapped.data;

    return {
      data: page.content,
      total: page.totalElements,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await blogApi.getBlog(id);
    const wrapped = res.data as { success: boolean; data: BlogResponse };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ create blog post
  async create(params: any) {
    const { variables } = params;

    const res = await blogApi.createBlog(variables);
    const wrapped = res.data as { success: boolean; data: BlogResponse };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update blog post
  async update(params: any) {
    const { id, variables } = params;

    const res = await blogApi.updateBlog(id, variables);
    const wrapped = res.data as { success: boolean; data: BlogResponse };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete blog post
  async deleteOne(params: any) {
    const { id } = params;

    const res = await blogApi.deleteBlog(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};
