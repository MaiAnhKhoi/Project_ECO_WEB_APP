import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";

import { AuthScreenShell } from "@/components/auth/AuthScreenShell";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { registerSchema } from "@/validations/authSchemas";

type FormValues = yup.InferType<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const registerAction = useAuthStore((s) => s.register);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onTouched",
  });

  const email = watch("email");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError("");
    setServerSuccess("");
    const res = await registerAction(values);
    if (!res.ok) {
      setServerError(res.message || "Đăng ký thất bại");
      setSubmitting(false);
      return;
    }
    setServerSuccess(res.message || "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
    setSubmitting(false);
    setTimeout(() => {
      router.replace({ pathname: "/auth/verify", params: { email } } as any);
    }, 600);
  };

  return (
    <AuthScreenShell
      title="Tạo tài khoản"
      subtitle="Đăng ký nhanh để mua sắm và theo dõi đơn hàng."
    >
      <LoadingSpinner visible={submitting} message="Đang tạo tài khoản…" fullscreen />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Họ và tên"
            placeholder="Họ và tên"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <View className="mt-3" />
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
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Số điện thoại (tuỳ chọn)"
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.phone?.message}
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

      <View className="mt-3" />
      <Controller
        control={control}
        name="passwordConfirm"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.passwordConfirm?.message}
          />
        )}
      />

      {serverError ? <Text className="mt-3 text-sm text-red-600">{serverError}</Text> : null}
      {serverSuccess ? <Text className="mt-3 text-sm text-green-700">{serverSuccess}</Text> : null}

      <View className="mt-5">
        <CustomButton title="Đăng ký" onPress={handleSubmit(onSubmit)} loading={submitting} />
      </View>

      <View className="mt-4 flex-row justify-center">
        <Link href="/auth/login" asChild>
          <Text className="text-sm text-blue-600">Đã có tài khoản? Đăng nhập</Text>
        </Link>
      </View>
    </AuthScreenShell>
  );
}

