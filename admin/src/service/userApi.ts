// src/api/userApi.ts
import axiosAdmin from "./axiosAdmin";
import type {
  User,
  UserPage,
  ApiResponse,
  Role,
  AssignRolesPayload,
  RolePage
} from "../type/user";

const userApi = {
  // 📌 Lấy danh sách user (paging)
  getUsers(
    page = 0,
    size = 20,
    options?: {
      type?: string;
    }
  ) {
    return axiosAdmin.get<ApiResponse<UserPage>>(`/users`, {
      params: { page, size, type: options?.type },
    });
  },

  // 📌 Lấy thông tin 1 user theo ID
  getUser(id: number) {
    return axiosAdmin.get<ApiResponse<User>>(`/users/${id}`);
  },

  // 📌 Tạo user mới
  createUser(data: Partial<User>) {
    return axiosAdmin.post<ApiResponse<User>>(`/users`, data);
  },

  // 📌 Cập nhật user
  updateUser(id: number, data: Partial<User>) {
    return axiosAdmin.put<ApiResponse<User>>(`/users/${id}`, data);
  },

  // 📌 Xóa user
  deleteUser(id: number) {
    return axiosAdmin.delete<ApiResponse<User | null>>(`/users/${id}`);
  },

  // 📌 Lấy danh sách user theo roleCode
  getUsersByRole(roleCode: string, page = 0, size = 20) {
    return axiosAdmin.get<ApiResponse<UserPage>>(
      `/users/by-role/${roleCode}`,
      { params: { page, size } }
    );
  },

  // ===============================
  //         ROLE APIs
  // ===============================

  // 📌 Lấy toàn bộ role trong hệ thống
  getRoles() {
    // BE: GET /roles -> ApiResponse<RolePage>
    return axiosAdmin.get<ApiResponse<RolePage>>(`/roles`);
  },
  // 📌 Lấy role theo ID (nếu cần để hiện chi tiết)
  getRole(roleId: number) {
    return axiosAdmin.get<ApiResponse<Role>>(`/roles/${roleId}`);
  },

  // 📌 Tạo role mới (nếu Admin được phép tự thêm role)
  createRole(data: { code: string; name: string }) {
    return axiosAdmin.post<ApiResponse<Role>>(`/roles`, data);
  },

  // 📌 Xóa role
  deleteRole(roleId: number) {
    return axiosAdmin.delete<ApiResponse<Role>>(`/roles/${roleId}`);
  },

  // 📌 Cập nhật role (tên, code)
  updateRole(roleId: number, data: Partial<Role>) {
    return axiosAdmin.put<ApiResponse<Role>>(`/roles/${roleId}`, data);
  },

  // ===============================
  //      ASSIGN ROLE APIs
  // ===============================

  // 📌 Gán nhiều role cho 1 user
  assignRoles(userId: number, roleIds: number[]) {
    const payload: AssignRolesPayload = { userId, roleIds };

    return axiosAdmin.post<ApiResponse<User>>(
      `/users/${userId}/assign-roles`,
      payload
    );
  },

  // 📌 Gỡ 1 role khỏi user
  removeRole(userId: number, roleId: number) {
    return axiosAdmin.delete<ApiResponse<User>>(
      `/users/${userId}/roles/${roleId}`
    );
  },

  // ===============================
  //         PERMISSION APIs
  // ===============================

  // 📌 Lấy permission theo roleId
  getRolePermissions(roleId: number) {
    return axiosAdmin.get<ApiResponse<any>>(`/roles/${roleId}/permissions`);
  },

  // 📌 Gán permissions cho role (nếu dùng)
  assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    return axiosAdmin.post<ApiResponse<Role>>(
      `/roles/${roleId}/assign-permissions`,
      { permissionIds }
    );
  },
};

export default userApi;
