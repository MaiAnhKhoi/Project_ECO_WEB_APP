/** Xác thực — khớp `authApi` / BE */

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface User {
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
}

/** Bao bì API chuẩn cho `/auth/*` */
export interface AuthApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: number;
}

export interface AuthLoginData {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
}

export type AuthLoginResponse = AuthApiResponse<AuthLoginData>;
export type AuthRegisterResponse = AuthApiResponse<User>;
