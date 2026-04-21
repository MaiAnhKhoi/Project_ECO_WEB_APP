import api from "@/config/api";

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
}

const userApi = {
  // Lấy profile hiện tại
  getProfile() {
    return api.get<{ success: boolean; data: UserProfile }>("/users/me/profile");
  },

  // Cập nhật profile
  updateProfile(data: UpdateProfileRequest) {
    return api.put<{ success: boolean; data: UserProfile; message?: string }>(
      "/users/me/profile",
      data
    );
  },

  // Upload avatar
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ success: boolean; data: UserProfile; message?: string }>(
      "/users/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default userApi;

