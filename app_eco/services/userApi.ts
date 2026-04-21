import { httpClient } from "@/lib/httpClient";

export type Gender = "male" | "female" | "other";

export type UserProfile = {
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
};

export type UpdateProfileRequest = {
  name?: string;
  username?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const userApi = {
  getProfile: (token: string) =>
    httpClient.get<ApiEnvelope<UserProfile>>("/users/me/profile", { token }),
  updateProfile: (token: string, payload: UpdateProfileRequest) =>
    httpClient.put<ApiEnvelope<UserProfile>>("/users/me/profile", payload, { token }),
  uploadAvatar: async (token: string, file: { uri: string; name: string; type: string }) => {
    // Use direct fetch to send multipart/form-data in RN
    const { getApiBaseUrl } = await import("@/config/api");
    const base = getApiBaseUrl();
    const url = `${base}/users/me/avatar`;

    const form = new FormData();
    form.append("file", file as any);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Upload avatar thất bại");
    }
    return (await res.json()) as ApiEnvelope<UserProfile>;
  },
};

