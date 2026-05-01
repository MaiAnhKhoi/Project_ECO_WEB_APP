/** Hồ sơ người dùng — `/users/me/*` */

export type Gender = "male" | "female" | "other";

export interface UserProfile {
  id: number;
  name: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface UserApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}
