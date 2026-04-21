// src/provider/userProvider.ts
import userApi from "../service/userApi";
import type { UserPage, User, ApiResponse, Role, RolePage } from "../type/user";
import { getPaginationFromUrl } from "../utils/pagination";

export const userProvider = {
  // ⚡ getList cho Refine (admin users)
  async getList(params: any) {
    const { pagination, filters } = params;

    // 🔍 Lấy pagination từ URL
    const { current, pageSize } = getPaginationFromUrl(pagination);

    let category: string | undefined;
    if (Array.isArray(filters)) {
      const found = filters.find((f: any) => f.field === "category");
      category = found?.value as string | undefined;
    }

    const res = await userApi.getUsers(current - 1, pageSize, {
      type: category,
    });

    const wrapped = res.data as ApiResponse<UserPage>;
    const page = wrapped.data;

    return {
      data: page.content ?? [],
      total: page.totalElements ?? 0,
    };
  },

  // ⚡ getOne
  async getOne(params: any) {
    const { id } = params;
    const numericId = Number(id);

    const res = await userApi.getUser(numericId);
    const wrapped = res.data as ApiResponse<User>;

    return {
      data: wrapped.data,
    };
  },

  // ⚡ create
  async create(params: any) {
    const { variables } = params;
    const res = await userApi.createUser(variables);
    const wrapped = res.data as ApiResponse<User>;

    return { data: wrapped.data };
  },

  // ⚡ update
  async update(params: any) {
    const { id, variables } = params;
    const numericId = Number(id);

    const res = await userApi.updateUser(numericId, variables);
    const wrapped = res.data as ApiResponse<User>;

    return { data: wrapped.data };
  },

  // ⚡ delete
  async deleteOne(params: any) {
    const { id } = params;
    const numericId = Number(id);

    const res = await userApi.deleteUser(numericId);
    const wrapped = res.data as ApiResponse<User | null>;

    return { data: wrapped.data };
  },

  async getRoles() {
    const res = await userApi.getRoles();
    const wrapped = res.data as ApiResponse<RolePage>;
    const page = wrapped.data;
    return page?.content ?? [];
  },

  async assignRoles(userId: number, roleIds: number[]) {
    const res = await userApi.assignRoles(userId, roleIds);
    const wrapped = res.data as ApiResponse<User>;
    return { data: wrapped.data };
  },
};
