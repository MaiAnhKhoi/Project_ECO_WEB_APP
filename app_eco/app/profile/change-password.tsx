import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";

const schema = yup.object({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: yup.string().required("Vui lòng nhập mật khẩu mới").min(8, "Mật khẩu tối thiểu 8 ký tự"),
  newPasswordConfirm: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu mới")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

type FormValues = yup.InferType<typeof schema>;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) return;
    navLockRun(() => router.push({ pathname: "/auth/login", params: { next: "/profile" } } as any));
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", newPasswordConfirm: "" },
    mode: "onTouched",
  });

  const m = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await authApi.changePassword(token!, values);
      if (!res.success) throw new Error(res.message || "Đổi mật khẩu thất bại");
      return res;
    },
    onSuccess: () => {
      reset();
      navLockRun(() => router.back());
    },
  });

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner visible={m.isPending} message="Đang đổi mật khẩu…" fullscreen />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton onPress={() => navLockRun(() => router.back())} accessibilityLabel="Quay lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            Đổi mật khẩu
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <View className="flex-1 px-4 pt-4">
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.currentPassword?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.newPassword?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="newPasswordConfirm"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.newPasswordConfirm?.message}
            />
          )}
        />

        {m.error ? (
          <Text className="mt-3 text-sm text-red-600">
            {(m.error as any)?.message || "Đổi mật khẩu thất bại"}
          </Text>
        ) : null}

        <View className="mt-6">
          <CustomButton title="Xác nhận" onPress={handleSubmit((v) => m.mutateAsync(v))} loading={m.isPending} />
        </View>
      </View>
    </SafeAreaView>
  );
}

