// src/providers/bannerProvider.ts
import bannerApi from "../service/bannerApi";
import type { Banner, BannerPage } from "../type/banner";
import { getPaginationFromUrl } from "../utils/pagination";

export const bannerProvider = {
  // ⚡ getList cho Refine (admin banners)
  async getList(params: any) {
    const { pagination, filters } = params;
    
    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let position: string | undefined;
    let active: boolean | undefined;
    let keyword: string | undefined;

    if (Array.isArray(filters)) {
      for (const f of filters) {
        if (f.field === "position") position = f.value;
        if (f.field === "active") active = f.value;
        if (f.field === "keyword") keyword = f.value;
      }
    }

    const res = await bannerApi.getBannersAdmin(
      current - 1,
      pageSize,
      position,
      active,
      keyword,
    );

    const wrapped = res.data as { success: boolean; data: BannerPage };
    const page: BannerPage = wrapped.data;

    return {
      data: page.content,
      total: page.totalElements,
    };
  },

  // ⚡ getOne cho Refine
  async getOne(params: any) {
    const { id } = params;

    const res = await bannerApi.getBanner(id);
    const wrapped = res.data as { success: boolean; data: Banner };
    const banner: Banner = wrapped.data;

    return {
      data: banner,
    };
  },

  // ⚡ create banner (multipart/form-data)
  async create(params: any) {
    const { variables } = params;

    // 👇 EXPECT: variables là FormData (tạo ở BannerCreate)
    const formData = variables as FormData;

    const res = await bannerApi.createBanner(formData);
    const wrapped = res.data as { success: boolean; data: Banner };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ update banner (multipart/form-data)
  async update(params: any) {
    const { id, variables } = params;

    // 👇 EXPECT: variables là FormData (tạo ở BannerEdit)
    const formData = variables as FormData;

    const res = await bannerApi.updateBanner(id, formData);
    const wrapped = res.data as { success: boolean; data: Banner };

    return {
      data: wrapped.data,
    };
  },

  // ⚡ delete banner
  async deleteOne(params: any) {
    const { id } = params;

    const res = await bannerApi.deleteBanner(id);
    const wrapped = res.data as { success: boolean; data: null };

    return {
      data: wrapped.data,
    };
  },
};
