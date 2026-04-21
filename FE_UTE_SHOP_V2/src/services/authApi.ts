import api from "@/config/api";

export interface Role {
  id: number;
  code: string;
  name: string;
  permissions: any[];
}

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  avatarUrl?: string;
  status: string;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
  timestamp: number;
}
export interface GetProfileResponse {
  success: boolean;
  data: User;
  timestamp: number;
}
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
  timestamp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: number;
}

const authApi = {
  // Đăng ký tài khoản mới
  register(data: RegisterRequest) {
    return api.post<RegisterResponse>("/auth/register", data);
  },

  // Xác thực email với mã OTP
  verifyEmail(data: { email: string; code: string }) {
    return api.post<ApiResponse>("/auth/verify-email", data);
  },

  // Gửi lại mã xác thực
  resendVerification(data: { email: string }) {
    return api.post<ApiResponse>("/auth/resend-verification", data);
  },

  // Login
  login(data: { email: string; password: string }) {
    return api.post<LoginResponse>("/auth/login", data);
  },

  // Refresh token
  refreshToken(refreshToken: string) {
    return api.post("/auth/refresh-token", { refreshToken });
  },

  // Lấy thông tin user đang đăng nhập
  getProfile() {
    return api.get<GetProfileResponse>("/auth/me");
  },

  // Logout
  logout() {
    return api.post("/auth/logout");
  },

  // Quên mật khẩu - Gửi mã reset về email
  forgotPassword(data: { email: string }) {
    return api.post<ApiResponse>("/auth/forgot-password", data);
  },

  // Reset mật khẩu với mã xác thực
  resetPassword(data: { email: string; code: string; newPassword: string; newPasswordConfirm: string }) {
    return api.post<ApiResponse>("/auth/reset-password", data);
  },

  // Đổi mật khẩu
  changePassword(data: { currentPassword: string; newPassword: string; newPasswordConfirm: string }) {
    return api.post<ApiResponse>("/auth/change-password", data);
  },
};

export default authApi;
