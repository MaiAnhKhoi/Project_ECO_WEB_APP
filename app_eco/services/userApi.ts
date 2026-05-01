import { httpClient } from "@/lib/httpClient";
import type { UpdateProfileRequest, UserApiEnvelope, UserProfile } from "@/types/userProfile";

export const userApi = {
  getProfile: (token: string) =>
    httpClient.get<UserApiEnvelope<UserProfile>>("/users/me/profile", { token }),
  updateProfile: (token: string, payload: UpdateProfileRequest) =>
    httpClient.put<UserApiEnvelope<UserProfile>>("/users/me/profile", payload, { token }),
  uploadAvatar: async (token: string, file: { uri: string; name: string; type: string }) => {
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
    return (await res.json()) as UserApiEnvelope<UserProfile>;
  },
};
