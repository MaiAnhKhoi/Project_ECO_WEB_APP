import axiosAdmin from "./axiosAdmin";
import type { LoginResponse, LoginData } from "../type/auth";
import axios from "axios";

export const authService = {
  login: async (data: { email: string; password: string }): Promise<LoginData> => {
    try {
      const res = await axiosAdmin.post<LoginResponse>("/auth/login", data);

      if (!res.data.success) {
        const errorMessage = res.data.message || "Email hoặc mật khẩu không đúng";
        const error: any = new Error(errorMessage);
        error.response = {
          data: {
            success: false,
            message: errorMessage,
          },
          status: 401,
        };
        throw error;
      }

      const loginData = res.data.data;

      // Không lưu vào localStorage ở đây, để authProvider xử lý
      // localStorage.setItem("accessToken", loginData.accessToken);
      // localStorage.setItem("refreshToken", loginData.refreshToken);
      // localStorage.setItem("user", JSON.stringify(loginData.user));

      return loginData;
    } catch (error: any) {
      // Nếu là axios error, giữ nguyên để authProvider xử lý
      if (axios.isAxiosError(error)) {
        // Đảm bảo có message trong response.data
        if (error.response?.data) {
          if (!error.response.data.message) {
            error.response.data.message = 
              error.response.data.message || 
              error.message || 
              "Email hoặc mật khẩu không đúng";
          }
        } else {
          // Nếu không có response.data, tạo một error response chuẩn
          const errorMessage = error.message || "Email hoặc mật khẩu không đúng";
          error.response = {
            data: {
              success: false,
              message: errorMessage,
            },
            status: error.response?.status || 401,
            statusText: "Unauthorized",
            headers: {},
            config: {} as any,
          } as any;
        }
        throw error;
      }
      
      // Nếu không phải axios error, wrap nó
      const errorMessage = error?.message || "Email hoặc mật khẩu không đúng";
      const wrappedError: any = new Error(errorMessage);
      wrappedError.response = {
        data: {
          success: false,
          message: errorMessage,
        },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config: {} as any,
      } as any;
      throw wrappedError;
    }
  },
};

