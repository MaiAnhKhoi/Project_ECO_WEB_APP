import { httpClient } from "@/lib/httpClient";
import type {
  AuthApiResponse,
  AuthLoginResponse,
  AuthRegisterResponse,
  User,
} from "@/types/auth";

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    httpClient.post<AuthLoginResponse>("/auth/login", payload),
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    passwordConfirm: string;
  }) => httpClient.post<AuthRegisterResponse>("/auth/register", payload),
  me: (token: string) => httpClient.get<AuthApiResponse<User>>("/auth/me", { token }),
  verifyEmail: (payload: { email: string; code: string }) =>
    httpClient.post<AuthApiResponse<unknown>>("/auth/verify-email", payload),
  resendVerification: (payload: { email: string }) =>
    httpClient.post<AuthApiResponse<unknown>>("/auth/resend-verification", payload),
  forgotPassword: (payload: { email: string }) =>
    httpClient.post<AuthApiResponse<unknown>>("/auth/forgot-password", payload),
  resetPassword: (payload: {
    email: string;
    code: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => httpClient.post<AuthApiResponse<unknown>>("/auth/reset-password", payload),
  changePassword: (
    token: string,
    payload: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    }
  ) => httpClient.post<AuthApiResponse<unknown>>("/auth/change-password", payload, { token }),
};
