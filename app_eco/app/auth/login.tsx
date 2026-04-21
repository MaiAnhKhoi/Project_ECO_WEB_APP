import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";

import { AuthScreenShell } from "@/components/auth/AuthScreenShell";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/validations/authSchemas";

type FormValues = yup.InferType<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const next = useMemo(() => (params.next && params.next.startsWith("/") ? params.next : "/(tabs)"), [params.next]);
  const colors = useAppColors();

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const loginLoading = useAuthStore((s) => s.loginLoading);

  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const email = watch("email");

  useEffect(() => {
    if (!user) return;
    navLockRun(() => router.replace(next as any));
  }, [user, next, router]);

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    const res = await login(values.email, values.password);
    if (!res.ok) {
      setServerError(res.message || "Đăng nhập thất bại");
      return;
    }
    navLockRun(() => router.replace(next as any));
  };

  return (
    <AuthScreenShell
      title="Đăng nhập"
      subtitle="Vui lòng đăng nhập để tiếp tục"
    >
      <LoadingSpinner visible={loginLoading} message="Đang đăng nhập…" fullscreen />

      <View className="items-center">
        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 41,
            backgroundColor: colors.surfaceMuted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppIcon name="user" size={30} color={colors.text} />
        </View>
        <Text className="mt-3 text-sm" style={{ color: colors.mutedText }}>
          Đăng nhập bằng email và mật khẩu
        </Text>
      </View>

      <View className="mt-5" />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Email"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <View className="mt-3" />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Mật khẩu"
            placeholder="Mật khẩu"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      {serverError ? (
        <Text className="mt-3 text-sm text-red-600">{serverError}</Text>
      ) : null}

      <View className="mt-5">
        <CustomButton
          title="Đăng nhập"
          onPress={handleSubmit(onSubmit)}
          loading={loginLoading}
        />
      </View>

      <View className="mt-4 flex-row gap-2">
        <View className="min-w-0 flex-1">
          <CustomButton
            title="Quên mật khẩu?"
            variant="secondary"
            onPress={() =>
              navLockRun(() =>
                router.push({ pathname: "/auth/forgot-password", params: { email } } as any)
              )
            }
            titleColor={colors.link}
            titleStyle={{ fontSize: 14, fontWeight: "500" }}
            style={{ paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "transparent" }}
            accessibilityLabel="Quên mật khẩu"
          />
        </View>
        <View className="min-w-0 flex-1">
          <CustomButton
            title="Tạo tài khoản"
            variant="secondary"
            onPress={() => navLockRun(() => router.push("/auth/register" as any))}
            titleColor={colors.link}
            titleStyle={{ fontSize: 14, fontWeight: "500" }}
            style={{ paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "transparent" }}
            accessibilityLabel="Tạo tài khoản"
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}

