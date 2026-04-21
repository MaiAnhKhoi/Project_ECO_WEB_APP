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

export interface RolePage {
  content: Role[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  status: string;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface UserPage {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Nếu API wrap trong data */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
}

/** Payload gửi lên để gán role cho user */
export interface AssignRolesPayload {
  userId: number;
  roleIds: number[];
}


