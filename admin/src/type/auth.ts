export interface Permission {
  id: number;
  code: string;
  description: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
  permissions: Permission[];
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  status: string;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
  timestamp: number;
}
