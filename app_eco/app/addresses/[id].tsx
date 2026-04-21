import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";
import { useAuthStore } from "@/store/authStore";
import { addressApi, type AddressRequest, type AddressResponse } from "@/services/addressApi";
import { addressSchema } from "@/validations/addressSchemas";

type FormValues = yup.InferType<typeof addressSchema>;

export default function EditAddressScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ id?: string }>();

  const id = useMemo(() => {
    const raw = params?.id;
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [params?.id]);

  useEffect(() => {
    if (user) return;
    navLockRun(() => router.push({ pathname: "/auth/login", params: { next: "/addresses" } } as any));
  }, [user, router]);

  const q = useQuery({
    queryKey: ["myAddresses"],
    queryFn: async () => addressApi.getMyAddresses(token!),
    enabled: !!token,
  });

  const current = useMemo<AddressResponse | null>(() => {
    const list = q.data ?? [];
    return id ? list.find((a) => a.id === id) ?? null : null;
  }, [q.data, id]);

  const [isDefault, setIsDefault] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(addressSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      city: "",
      province: "",
      region: "Vietnam",
      phone: "",
      isDefault: false,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!current) return;
    reset({
      firstName: current.firstName,
      lastName: current.lastName,
      company: current.company ?? "",
      address1: current.address1,
      city: current.city,
      province: current.province ?? "",
      region: current.region,
      phone: current.phone,
      isDefault: current.isDefault,
    });
    setIsDefault(!!current.isDefault);
  }, [current, reset]);

  const m = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: AddressRequest = { ...values, isDefault };
      return addressApi.updateAddress(token!, id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myAddresses"] });
      navLockRun(() => router.back());
    },
  });

  if (!user) return null;
  if (!id) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-4">
          <Text style={{ color: colors.text }} className="text-base font-semibold">
            Không tìm thấy địa chỉ
          </Text>
          <Text style={{ color: colors.mutedText }} className="mt-2 text-sm text-center">
            Địa chỉ không hợp lệ hoặc đã bị xoá.
          </Text>
          <View className="mt-4 w-full">
            <CustomButton title="Quay lại" onPress={() => navLockRun(() => router.back())} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner visible={q.isFetching || m.isPending} message="Đang tải…" fullscreen />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton onPress={() => navLockRun(() => router.back())} accessibilityLabel="Quay lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            Sửa địa chỉ
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <View className="flex-1 px-4 pt-4">
        <View className="flex-row gap-3">
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Họ"
                  placeholder="Họ"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.firstName?.message}
                />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Tên"
                  placeholder="Tên"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.lastName?.message}
                />
              )}
            />
          </View>
        </View>

        <View className="mt-3" />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Số điện thoại"
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
          name="address1"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Địa chỉ"
              placeholder="Số nhà, tên đường..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.address1?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Thành phố/Quận/Huyện"
              placeholder="VD: Thủ Đức"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.city?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="province"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Tỉnh/Thành (tuỳ chọn)"
              placeholder="VD: TP.HCM"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ""}
              error={errors.province?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="region"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Quốc gia/Khu vực"
              placeholder="Vietnam"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.region?.message}
            />
          )}
        />

        <Pressable
          onPress={() => setIsDefault((v) => !v)}
          className="mt-4 flex-row items-center active:opacity-80"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDefault }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: isDefault ? colors.tint : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDefault ? <AppIcon name="check" size={12} color="#fff" /> : null}
          </View>
          <Text className="ml-3 text-sm" style={{ color: colors.text }}>
            Đặt làm địa chỉ mặc định
          </Text>
        </Pressable>

        {m.error ? (
          <Text className="mt-3 text-sm text-red-600">
            {(m.error as any)?.message || "Không thể lưu địa chỉ"}
          </Text>
        ) : null}

        <View className="mt-6">
          <CustomButton
            title="Lưu thay đổi"
            onPress={handleSubmit((v: FormValues) => m.mutateAsync(v))}
            loading={m.isPending}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

