// src/contexts/authProvider.ts
import type { AuthProvider } from "@refinedev/core";
import { authService } from "../service/authService";

export const TOKEN_KEY = "refine-auth";
const REFRESH_TOKEN_KEY = "refine-refresh-token";
const USER_KEY = "refine-user";

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    const identifier = email || username;

    if (!identifier || !password) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Vui lòng nhập email và mật khẩu",
        },
      };
    }

    try {
      const loginData = await authService.login({
        email: identifier,
        password,
      });

      // loginData lấy từ response bạn gửi ở trên:
      // {
      //   accessToken, refreshToken, tokenType, expiresIn, user: {...}
      // }
      localStorage.setItem(TOKEN_KEY, loginData.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, loginData.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err: any) {
      // Xử lý nhiều trường hợp để lấy message chính xác
      let message = "Email hoặc mật khẩu không đúng";
      
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.response?.data?.error) {
        message = err.response.data.error;
      } else if (err?.message) {
        message = err.message;
      } else if (typeof err?.response?.data === "string") {
        message = err.response.data;
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message,
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  // 👉 Quyền chi tiết theo từng permission code (nếu cần dùng sau)
  getPermissions: async () => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    const userObj = JSON.parse(user);

    const role = userObj.roles?.[0]?.code || null;

    const permissions =
      userObj.roles?.flatMap((role: any) =>
        role.permissions?.map((p: any) => p.code)
      ) || [];

    return { role, permissions };
  },


  // ✅ TRẢ FULL USER (CÓ ROLES) ĐỂ RequireRoles ĐỌC ĐƯỢC
  getIdentity: async () => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    const userObj = JSON.parse(user);

    // Bây giờ useGetIdentity() sẽ nhận được:
    // {
    //   id, name, email, ..., roles: [{ code: "ADMIN", ... }]
    // }
    return userObj;
  },

  onError: async (error) => {
    if (error?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },
};
