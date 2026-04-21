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
import { verifyEmailSchema } from "@/validations/authSchemas";

type FormValues = yup.InferType<typeof verifyEmailSchema>;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const emailFromParams = useMemo(() => (params.email ? String(params.email) : ""), [params.email]);

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: { email: emailFromParams, code: "" },
    mode: "onTouched",
  });

  const email = watch("email");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError("");
    setServerSuccess("");
    try {
      const res = await authApi.verifyEmail({ email: values.email, code: values.code });
      if (!res.success) {
        setServerError(res.message || "Mã xác thực không đúng hoặc đã hết hạn!");
        setSubmitting(false);
        return;
      }
      setServerSuccess("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      setSubmitting(false);
      setTimeout(() => {
        router.replace({ pathname: "/auth/login", params: { next: "/(tabs)" } } as any);
      }, 800);
    } catch (e: any) {
      setServerError(e?.message || "Không thể xác thực. Vui lòng thử lại!");
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setResending(true);
    setServerError("");
    setServerSuccess("");
    try {
      const res = await authApi.resendVerification({ email });
      if (!res.success) setServerError(res.message || "Không thể gửi lại mã");
      else setServerSuccess("Đã gửi lại mã xác thực. Vui lòng kiểm tra email!");
    } catch (e: any) {
      setServerError(e?.message || "Không thể gửi lại mã");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthScreenShell
      title="Xác thực tài khoản"
      subtitle={emailFromParams ? `Nhập OTP đã gửi tới ${emailFromParams}` : "Nhập email và OTP để xác thực."}
    >
      <LoadingSpinner visible={submitting} message="Đang xác thực…" fullscreen />

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
            label="Mã OTP (6 số)"
            placeholder="______"
            keyboardType="number-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            maxLength={6}
            error={errors.code?.message}
          />
        )}
      />

      {serverError ? <Text className="mt-3 text-sm text-red-600">{serverError}</Text> : null}
      {serverSuccess ? <Text className="mt-3 text-sm text-green-700">{serverSuccess}</Text> : null}

      <View className="mt-5">
        <CustomButton title="Xác thực" onPress={handleSubmit(onSubmit)} loading={submitting} />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Link href="/auth/login" asChild>
          <Text className="text-sm text-blue-600">Đăng nhập</Text>
        </Link>
        <CustomButton
          title={resending ? "Đang gửi…" : "Gửi lại mã"}
          variant="secondary"
          onPress={onResend}
          disabled={resending || !email}
          loading={resending}
        />
      </View>
    </AuthScreenShell>
  );
}

