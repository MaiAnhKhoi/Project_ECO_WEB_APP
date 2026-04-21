import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/services/userApi";
import { updateProfileSchema } from "@/validations/profileSchemas";

type Gender = "male" | "female" | "other";

type FormValues = {
  name: string;
  phone: string;
  username?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatarUrl?: string;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) return;
    navLockRun(() => router.push({ pathname: "/auth/login", params: { next: "/profile" } } as any));
  }, [user, router]);

  const profileQ = useQuery({
    queryKey: ["meProfile"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await userApi.getProfile(token!);
      if (!res.success) throw new Error(res.message || "Không tải được hồ sơ");
      return res.data;
    },
  });

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: profileQ.data?.name ?? "",
      username: profileQ.data?.username ?? "",
      phone: profileQ.data?.phone ?? "",
      gender: (profileQ.data?.gender as any) ?? "other",
      dateOfBirth: profileQ.data?.dateOfBirth ?? "",
      avatarUrl: profileQ.data?.avatarUrl ?? "",
    }),
    [profileQ.data]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(updateProfileSchema) as any,
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const updateM = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await userApi.updateProfile(token!, {
        name: values.name,
        username: values.username,
        phone: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth || undefined,
        avatarUrl: values.avatarUrl || undefined,
      });
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      return res.data;
    },
    onSuccess: () => profileQ.refetch(),
  });

  const avatarM = useMutation({
    mutationFn: async (asset: ImagePicker.ImagePickerAsset) => {
      const mime = asset.mimeType || "image/jpeg";
      const name = asset.fileName || `avatar.${mime.includes("png") ? "png" : "jpg"}`;
      const res = await userApi.uploadAvatar(token!, { uri: asset.uri, type: mime, name });
      if (!res.success) throw new Error(res.message || "Upload avatar thất bại");
      return res.data;
    },
    onSuccess: (p) => {
      setLocalAvatarUri(null);
      profileQ.refetch();
      reset({
        ...defaultValues,
        avatarUrl: p.avatarUrl ?? "",
      });
    },
  });

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setLocalAvatarUri(asset.uri);
    avatarM.mutate(asset);
  };

  if (!user) return null;

  const avatarUri = localAvatarUri || profileQ.data?.avatarUrl || undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner
        visible={profileQ.isPending || updateM.isPending || avatarM.isPending}
        message={profileQ.isPending ? "Đang tải…" : avatarM.isPending ? "Đang tải ảnh…" : "Đang lưu…"}
        fullscreen
      />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton onPress={() => navLockRun(() => router.back())} accessibilityLabel="Quay lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            Cập nhật thông tin
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>

        <View className="items-center pt-5">
          <Pressable onPress={pickAvatar} className="active:opacity-80">
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: colors.iconButtonBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppIcon name="user" size={34} color={colors.text} />
              </View>
            )}
            <Text className="mt-2 text-center text-xs" style={{ color: colors.mutedText }}>
              Đổi ảnh đại diện
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1 px-4 pt-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Họ và tên *"
              placeholder="Nhập họ và tên"
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
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Username"
              placeholder="Chỉ chữ, số và dấu gạch dưới"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ""}
              error={errors.username?.message}
            />
          )}
        />

        <View className="mt-3" />
        <CustomInput
          label="Email"
          value={profileQ.data?.email ?? ""}
          editable={false}
          style={{ opacity: 0.7 }}
        />
        <Text className="mt-1 text-xs" style={{ color: colors.mutedText }}>
          Email không thể thay đổi
        </Text>

        <View className="mt-3" />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ""}
              error={errors.phone?.message}
            />
          )}
        />

        <View className="mt-3" />
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Ngày sinh (YYYY-MM-DD)"
              placeholder="YYYY-MM-DD"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ""}
              error={errors.dateOfBirth?.message}
            />
          )}
        />

        {updateM.error ? (
          <Text className="mt-3 text-sm text-red-600">
            {(updateM.error as any)?.message || "Cập nhật thất bại"}
          </Text>
        ) : null}

        <View className="mt-6 flex-row gap-3">
          <View style={{ flex: 1 }}>
            <CustomButton
              title="Lưu thay đổi"
              onPress={handleSubmit((v: FormValues) => updateM.mutateAsync(v))}
              loading={updateM.isPending}
              disabled={!isDirty || updateM.isPending}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton
              title="Hủy"
              variant="secondary"
              onPress={() => navLockRun(() => router.back())}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

