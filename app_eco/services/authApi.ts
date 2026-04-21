import { httpClient } from "@/lib/httpClient";

export type Role = {
  id: number;
  code: string;
  name: string;
};

export type User = {
  id: number;
  name: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified?: boolean;
  status?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  roles?: Role[];
  avatarUrl?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp?: number;
};

export type LoginResponse = ApiResponse<{
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
}>;

export type RegisterResponse = ApiResponse<User>;

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    httpClient.post<LoginResponse>("/auth/login", payload),
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    passwordConfirm: string;
  }) => httpClient.post<RegisterResponse>("/auth/register", payload),
  me: (token: string) => httpClient.get<ApiResponse<User>>("/auth/me", { token }),
  verifyEmail: (payload: { email: string; code: string }) =>
    httpClient.post<ApiResponse<unknown>>("/auth/verify-email", payload),
  resendVerification: (payload: { email: string }) =>
    httpClient.post<ApiResponse<unknown>>("/auth/resend-verification", payload),
  forgotPassword: (payload: { email: string }) =>
    httpClient.post<ApiResponse<unknown>>("/auth/forgot-password", payload),
  resetPassword: (payload: {
    email: string;
    code: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => httpClient.post<ApiResponse<unknown>>("/auth/reset-password", payload),
  changePassword: (
    token: string,
    payload: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    }
  ) => httpClient.post<ApiResponse<unknown>>("/auth/change-password", payload, { token }),
};

