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
import { forgotPasswordSchema } from "@/validations/authSchemas";

type FormValues = yup.InferType<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
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
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: emailFromParams },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError("");
    setServerSuccess("");
    try {
      const res = await authApi.forgotPassword({ email: values.email });
      if (!res.success) {
        setServerError(res.message || "Không thể gửi mã. Vui lòng thử lại!");
        setSubmitting(false);
        return;
      }
      setServerSuccess(res.message || "Đã gửi mã đặt lại mật khẩu. Vui lòng kiểm tra email!");
      setSubmitting(false);
      setTimeout(() => {
        router.replace({ pathname: "/auth/reset-password", params: { email: values.email } } as any);
      }, 700);
    } catch (e: any) {
      setServerError(e?.message || "Không thể gửi mã. Vui lòng thử lại!");
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell title="Quên mật khẩu" subtitle="Nhập email để nhận mã đặt lại mật khẩu.">
      <LoadingSpinner visible={submitting} message="Đang gửi mã…" fullscreen />

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

      {serverError ? <Text className="mt-3 text-sm text-red-600">{serverError}</Text> : null}
      {serverSuccess ? <Text className="mt-3 text-sm text-green-700">{serverSuccess}</Text> : null}

      <View className="mt-5">
        <CustomButton title="Gửi mã" onPress={handleSubmit(onSubmit)} loading={submitting} />
      </View>

      <View className="mt-4 flex-row justify-center">
        <Link href="/auth/login" asChild>
          <Text className="text-sm text-blue-600">Quay lại đăng nhập</Text>
        </Link>
      </View>
    </AuthScreenShell>
  );
}

