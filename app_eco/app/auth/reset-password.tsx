import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";

import { AuthScreenShell } from "@/components/auth/AuthScreenShell";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { authApi } from "@/services/authApi";
import { resetPasswordSchema } from "@/validations/authSchemas";

type FormValues = yup.InferType<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const emailFromParams = useMemo(() => (params.email ? String(params.email) : ""), [params.email]);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromParams,
      code: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError("");
    setServerSuccess("");
    try {
      const res = await authApi.resetPassword(values);
      if (!res.success) {
        setServerError(res.message || "Không thể đặt lại mật khẩu.");
        setSubmitting(false);
        return;
      }
      setServerSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      setSubmitting(false);
      setTimeout(() => {
        router.replace("/auth/login" as any);
      }, 900);
    } catch (e: any) {
      setServerError(e?.message || "Không thể đặt lại mật khẩu.");
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell title="Đặt lại mật khẩu" subtitle="Nhập OTP và mật khẩu mới.">
      <LoadingSpinner visible={submitting} message="Đang đặt lại…" fullscreen />

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
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="OTP (6 số)"
            placeholder="______"
            keyboardType="number-pad"
            maxLength={6}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.code?.message}
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
            placeholder="Mật khẩu mới"
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
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.newPasswordConfirm?.message}
          />
        )}
      />

      {serverError ? <Text className="mt-3 text-sm text-red-600">{serverError}</Text> : null}
      {serverSuccess ? <Text className="mt-3 text-sm text-green-700">{serverSuccess}</Text> : null}

      <View className="mt-5">
        <CustomButton title="Đặt lại mật khẩu" onPress={handleSubmit(onSubmit)} loading={submitting} />
      </View>

      <View className="mt-4 flex-row justify-center">
        <Link href="/auth/login" asChild>
          <Text className="text-sm text-blue-600">Quay lại đăng nhập</Text>
        </Link>
      </View>
    </AuthScreenShell>
  );
}

