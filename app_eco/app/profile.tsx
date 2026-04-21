import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { navLockRun } from "@/utils/navLock";
import { userApi } from "@/services/userApi";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (user) return;
    navLockRun(() =>
      router.push({ pathname: "/auth/login", params: { next: "/profile" } } as any)
    );
  }, [user, router]);

  const enabled = Boolean(token);
  const profileQ = useQuery({
    queryKey: ["meProfile"],
    enabled,
    queryFn: async () => {
      const res = await userApi.getProfile(token!);
      if (!res.success) throw new Error(res.message || "Không tải được hồ sơ");
      return res.data;
    },
  });

  if (!user) return null;

  const role = user.roles?.[0]?.name || "Customer";
  const status = (user.status || "ACTIVE").toLowerCase().includes("lock")
    ? "Bị khóa"
    : "Hoạt động";
  const lastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
    : "—";

  const handleBack = () => {
    navLockRun(() => {
      if (params.from === "aside") {
        router.back();
        // Aside là modal ngoài router stack, nên back về màn trước rồi mở lại aside
        setTimeout(() => openAside(), 0);
      } else {
        router.back();
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner
        visible={profileQ.isPending}
        message="Đang tải hồ sơ…"
        fullscreen
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <CustomIconButton onPress={handleBack} accessibilityLabel="Trở lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Hồ sơ
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>

        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            padding: 14,
          }}
        >
          <Text className="text-[24px] font-bold" style={{ color: colors.text }}>
            Xin chào, {profileQ.data?.name || user.name}
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm" style={{ color: colors.mutedText }}>
              Mã khách hàng: #{user.id}
            </Text>
            <View
              style={{
                backgroundColor: status === "Hoạt động" ? "#16A34A" : "#DC2626",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text className="text-xs font-semibold text-white">
                Trạng thái: {status}
              </Text>
            </View>
          </View>
          <Text className="mt-2 text-xs" style={{ color: colors.mutedText }}>
            Lần đăng nhập gần nhất: {lastLogin}
          </Text>
        </View>

        {profileQ.error ? (
          <Text className="mt-4 text-sm text-red-600">
            {(profileQ.error as any)?.message || "Không tải được hồ sơ"}
          </Text>
        ) : null}

        <View className="mt-6">
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              padding: 14,
            }}
          >
            <Text className="text-[18px] font-semibold" style={{ color: colors.text }}>
              Thông tin cá nhân
            </Text>
            <View className="mt-4">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Họ và tên
              </Text>
              <Text className="mt-1 text-sm font-semibold" style={{ color: colors.text }}>
                {profileQ.data?.name || "—"}
              </Text>
            </View>
            <View className="mt-3">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Email
              </Text>
              <View className="mt-1 flex-row items-center justify-between">
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                  {profileQ.data?.email || "—"}
                </Text>
                <View
                  style={{
                    backgroundColor: profileQ.data?.emailVerified ? "#16A34A" : "#6B7280",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                  }}
                >
                  <Text className="text-[11px] font-semibold text-white">
                    {profileQ.data?.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-3">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Số điện thoại
              </Text>
              <View className="mt-1 flex-row items-center justify-between">
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                  {profileQ.data?.phone || "—"}
                </Text>
                <View
                  style={{
                    backgroundColor: profileQ.data?.phoneVerified ? "#16A34A" : "#4F46E5",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                  }}
                >
                  <Text className="text-[11px] font-semibold text-white">
                    {profileQ.data?.phoneVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            className="mt-4"
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              padding: 14,
            }}
          >
            <Text className="text-[18px] font-semibold" style={{ color: colors.text }}>
              Thông tin tài khoản
            </Text>
            <View className="mt-4">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Vai trò
              </Text>
              <Text className="mt-1 text-sm font-semibold" style={{ color: colors.text }}>
                {role}
              </Text>
            </View>
            <View className="mt-3">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Xác thực 2 bước
              </Text>
              <Text className="mt-1 text-sm font-semibold" style={{ color: colors.text }}>
                {user.twoFactorEnabled ? "Đã bật" : "Chưa bật"}
              </Text>
            </View>
            <View className="mt-3">
              <Text className="text-xs" style={{ color: colors.mutedText }}>
                Trạng thái tài khoản
              </Text>
              <Text className="mt-1 text-sm font-semibold" style={{ color: colors.text }}>
                {status === "Hoạt động" ? "Đang hoạt động" : status}
              </Text>
            </View>

            <View className="mt-5" style={{ alignItems: "stretch" }}>
              <CustomButton
                title="Cập nhật thông tin"
                variant="secondary"
                onPress={() => navLockRun(() => router.push("/profile/edit" as any))}
                style={{ width: "100%" }}
              />
              <View className="mt-3" />
              <CustomButton
                title="Đổi mật khẩu"
                variant="secondary"
                onPress={() => navLockRun(() => router.push("/profile/change-password" as any))}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
