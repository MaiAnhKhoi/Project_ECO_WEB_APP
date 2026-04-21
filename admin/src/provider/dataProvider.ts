// src/provider/dataProvider.ts
import type { DataProvider } from "@refinedev/core";
import axiosAdmin from "../service/axiosAdmin";
import { getPaginationFromUrl } from "../utils/pagination";

import { userProvider } from "./userProvider";
import { brandProvider } from "./brandProvider";
import { categoryProvider } from "./categoryProvider";
import { productProvider } from "./productProvider";
import { couponProvider } from "./couponProvider";
import { bannerProvider } from "./bannerProvider";
import { chatProvider } from "./chatProvider";
import { orderProvider } from "./orderProvider";
import { attributeProvider } from "./attributeProvider";
import { blogProvider } from "./blogProvider";
import { blogCategoryProvider } from "./blogCategoryProvider";
import { reviewProvider } from "./reviewProvider";
import { contactMessageProvider } from "./contactMessageProvider";

export const dataProvider: DataProvider = {
  // ===============================
  //           GET LIST
  // ===============================
  getList: async (params) => {
    const { resource } = params as any;

    // 🧩 USER — dùng provider riêng
    if (resource === "users") {
      return userProvider.getList(params);
    }

    // 🧩 BRANDS — provider riêng (có paging, Cloudinary)
    if (resource === "brands") {
      return brandProvider.getList(params);
    }

    // 🧩 CATEGORIES — provider riêng (có paging, Cloudinary)
    if (resource === "categories") {
      return categoryProvider.getList(params);
    }

    // 🧩 PRODUCTS — provider riêng (có paging, Cloudinary, variants)
    if (resource === "products") {
      return productProvider.getList(params);
    }

    if (resource === "coupons") {
      return couponProvider.getList(params);
    }

    if (resource === "banners") {
      return bannerProvider.getList(params);
    }
     if (resource === "customer-chat-threads" || resource === "direct-chat-threads") {
      return chatProvider.getList(params);
    }
        // 🧩 ORDERS — admin order list
    if (resource === "orders") {
      return orderProvider.getList(params);
    }
    if (resource === "attributes") {
      return attributeProvider.getList(params);
    }

    if (resource === "blog_posts") {
      return blogProvider.getList(params);
    }

    if (resource === "blog-categories") {
      return blogCategoryProvider.getList(params);
    }
    if (resource === "reviews" || resource === "reviews-admin") {
      return reviewProvider.getList(params);
    }
    if (resource === "contact-messages") {
      return contactMessageProvider.getList(params);
    }

    // 🧩 INVITATIONS — backend GET /roles/invitations
    if (resource === "roles/invitations" || resource === "roles/invite") {
      const pagination: any = (params as any).pagination ?? {};
      const { current, pageSize } = getPaginationFromUrl(pagination);

      const res = await axiosAdmin.get(`/roles/invitations`, {
        params: { page: current - 1, size: pageSize },
      });

      const wrapped = res.data;
      const page = wrapped.data ?? wrapped;

      return {
        data: page.content ?? page,
        total: page.totalElements ?? page.length ?? 0,
      };
    }

    // 🧩 ROLES — backend GET /roles
    if (resource === "roles") {
      const pagination: any = (params as any).pagination ?? {};
      const { current, pageSize } = getPaginationFromUrl(pagination);

      const res = await axiosAdmin.get(`/roles`, {
        params: { page: current - 1, size: pageSize },
      });

      const wrapped = res.data;
      const page = wrapped.data ?? wrapped;

      return {
        data: page.content ?? page,
        total: page.totalElements ?? page.length ?? 0,
      };
    }

    // 📌 generic cho resource khác
    const pagination: any = (params as any).pagination ?? {};
    const { current, pageSize } = getPaginationFromUrl(pagination);

    const res = await axiosAdmin.get(`/${resource}`, {
      params: {
        page: current - 1,
        size: pageSize,
      },
    });

    const wrapped = res.data;

    const data = wrapped?.data?.content ?? wrapped?.data ?? wrapped;
    const total =
      wrapped?.data?.totalElements ??
      wrapped?.total ??
      (Array.isArray(data) ? data.length : 0);

    return {
      data,
      total,
    };
  },

  // ===============================
  //            GET ONE
  // ===============================
  getOne: async (params) => {
    const { resource, id } = params as any;

    if (resource === "users") {
      return userProvider.getOne(params);
    }

    if (resource === "brands") {
      return brandProvider.getOne(params);
    }

    if (resource === "categories") {
      return categoryProvider.getOne(params);
    }

    if (resource === "products") {
      return productProvider.getOne(params);
    }

    if (resource === "coupons") {
      return couponProvider.getOne(params);
    }

    if (resource === "banners") {
      return bannerProvider.getOne(params);
    }

    if (resource === "orders") {
      return orderProvider.getOne(params);
    }
    if (resource === "attributes") {
      return attributeProvider.getOne(params);
    }

    if (resource === "blog_posts") {
      return blogProvider.getOne(params);
    }

    if (resource === "blog-categories") {
      return blogCategoryProvider.getOne(params);
    }
    if (resource === "reviews" || resource === "reviews-admin") {
      return reviewProvider.getOne(params);
    }
    if (resource === "contact-messages") {
      return contactMessageProvider.getOne(params);
    }

    if (resource === "roles") {
      const res = await axiosAdmin.get(`/roles/${id}`);
      const wrapped = res.data;
      return { data: wrapped.data ?? wrapped };
    }

    const res = await axiosAdmin.get(`/${resource}/${id}`);
    const wrapped = res.data;

    return { data: wrapped.data ?? wrapped };
  },

  // ===============================
  //            CREATE
  // ===============================
  create: async (params) => {
    const { resource } = params as any;

    if (resource === "users") {
      return userProvider.create(params);
    }

    if (resource === "brands") {
      return brandProvider.create(params);
    }

    if (resource === "categories") {
      return categoryProvider.create(params);
    }

    if (resource === "products") {
      return productProvider.create(params);
    }

    if (resource === "coupons") {
      return couponProvider.create(params);
    }

    if (resource === "banners") {
      return bannerProvider.create(params);
    }
    if (resource === "attributes") {
      return attributeProvider.create(params);
    }

    if (resource === "blog_posts") {
      return blogProvider.create(params);
    }

    if (resource === "blog-categories") {
      return blogCategoryProvider.create(params);
    }
    if (resource === "reviews-admin") {
      // Reviews are created by users, not admins
      throw new Error("Create review is not supported from admin");
    }
    if (resource === "contact-messages") {
      // Contact messages are created by users, not admins
      throw new Error("Create contact message is not supported from admin");
    }

    // 🧩 INVITE STAFF — backend POST /roles/invite
    if (resource === "roles/invite") {
      const res = await axiosAdmin.post(`/roles/invite`, params.variables);
      const wrapped = res.data;
      return { data: wrapped.data ?? wrapped };
    }

    if (resource === "roles") {
      const res = await axiosAdmin.post(`/roles`, params.variables);
      const wrapped = res.data;
      return { data: wrapped.data ?? wrapped };
    }

    const res = await axiosAdmin.post(`/${resource}`, params.variables);
    const wrapped = res.data;

    return { data: wrapped.data ?? wrapped };
  },

  // ===============================
  //             UPDATE
  // ===============================
  update: async (params) => {
    const { resource } = params as any;

    if (resource === "users") {
      return userProvider.update(params);
    }

    if (resource === "brands") {
      return brandProvider.update(params);
    }

    if (resource === "categories") {
      return categoryProvider.update(params);
    }

    if (resource === "products") {
      return productProvider.update(params);
    }

    if (resource === "coupons") {
      return couponProvider.update(params);
    }

    if (resource === "banners") {
      return bannerProvider.update(params);
    }

    if (resource === "blog_posts") {
      return blogProvider.update(params);
    }

    if (resource === "blog-categories") {
      return blogCategoryProvider.update(params);
    }
    if (resource === "reviews" || resource === "reviews-admin") {
      return reviewProvider.update(params);
    }
    if (resource === "contact-messages") {
      return contactMessageProvider.update(params);
    }

    if (resource === "roles") {
      const res = await axiosAdmin.put(
        `/roles/${params.id}`,
        params.variables
      );
      const wrapped = res.data;
      return { data: wrapped.data ?? wrapped };
    }

    const res = await axiosAdmin.put(
      `/${resource}/${params.id}`,
      params.variables
    );
    const wrapped = res.data;

    return { data: wrapped.data ?? wrapped };
  },

  // ===============================
  //             DELETE
  // ===============================
  deleteOne: async (params) => {
    const { resource } = params as any;

    if (resource === "users") {
      return userProvider.deleteOne(params);
    }

    if (resource === "brands") {
      return brandProvider.deleteOne(params);
    }

    if (resource === "categories") {
      return categoryProvider.deleteOne(params);
    }

    if (resource === "products") {
      return productProvider.deleteOne(params);
    }

    if (resource === "coupons") {
      return couponProvider.deleteOne(params);
    }

    if (resource === "banners") {
      return bannerProvider.deleteOne(params);
    }
    if (resource === "attributes") {
      return attributeProvider.deleteOne(params);
    }

    if (resource === "blog_posts") {
      return blogProvider.deleteOne(params);
    }

    if (resource === "blog-categories") {
      return blogCategoryProvider.deleteOne(params);
    }
    if (resource === "reviews-admin") {
      // Reviews deletion may not be supported or should be handled differently
      throw new Error("Delete review is not supported from admin");
    }
    if (resource === "contact-messages") {
      // Contact messages deletion may not be supported or should be handled differently
      throw new Error("Delete contact message is not supported from admin");
    }

    if (resource === "roles") {
      const res = await axiosAdmin.delete(`/roles/${params.id}`);
      const wrapped = res.data;
      return { data: wrapped.data ?? wrapped };
    }
    

    const res = await axiosAdmin.delete(`/${resource}/${params.id}`);
    const wrapped = res.data;

    return { data: wrapped.data ?? wrapped };
  },

  // ===============================
  //    NOT USING THESE YET
  // ===============================
  getApiUrl: () => "",
  getMany: async () => ({ data: [] }),
  createMany: async () => ({ data: [] }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
};
