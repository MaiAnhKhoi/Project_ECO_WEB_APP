import { useLocalSearchParams, useRouter } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import type * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { contactMessageApi } from "@/services/contactMessageApi";
import { shopSettingApi } from "@/services/shopSettingApi";
import { contactSchema } from "@/validations/contactSchemas";
import { navLockRun } from "@/utils/navLock";

type FormValues = yup.InferType<typeof contactSchema>;

export default function ContactScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const params = useLocalSearchParams<{ from?: string }>();

  const infoQ = useQuery({
    queryKey: ["shopSettings", "contactInfo"],
    queryFn: async () => shopSettingApi.getShopSettings(),
  });

  const info = infoQ.data;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(contactSchema) as any,
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  const m = useMutation({
    mutationFn: async (values: FormValues) => contactMessageApi.submit(values),
    onSuccess: () => reset({ name: "", email: "", message: "" }),
  });

  const links = useMemo(() => {
    if (!info) return null;
    return {
      map: info.address
        ? `https://www.google.com/maps?q=${encodeURIComponent(info.address)}`
        : null,
      tel: info.phone ? `tel:${String(info.phone).replace(/\s/g, "")}` : null,
      mail: info.email ? `mailto:${info.email}` : null,
      facebook: info.facebookUrl || null,
      instagram: info.instagramUrl || null,
      x: info.xUrl || null,
      snapchat: info.snapchatUrl || null,
    };
  }, [info]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner
        visible={infoQ.isFetching || m.isPending}
        message={m.isPending ? "Đang gửi…" : "Đang tải…"}
        fullscreen
      />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton
            onPress={() =>
              navLockRun(() => {
                if (params?.from === "aside") {
                  router.back();
                  setTimeout(() => openAside(), 0);
                  return;
                }
                router.back();
              })
            }
            accessibilityLabel="Trở lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="text-[16px] font-semibold" style={{ color: colors.text }}>
            Liên hệ
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-[18px] font-semibold" style={{ color: colors.text }}>
            Liên hệ với chúng tôi
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
            Có câu hỏi? Vui lòng liên hệ qua các kênh hỗ trợ bên dưới.
          </Text>

          {infoQ.error ? (
            <Text className="mt-3 text-sm" style={{ color: colors.danger }}>
              {(infoQ.error as any)?.message || "Không thể tải thông tin liên hệ."}
            </Text>
          ) : null}

          {info ? (
            <View className="mt-4 gap-3">
              <CustomButton
                subtitle="Địa chỉ"
                title={info.address || "—"}
                variant="secondary"
                onPress={() => links?.map && Linking.openURL(links.map)}
                disabled={!links?.map}
                titleStyle={{ fontSize: 14, fontWeight: "600" }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                accessibilityLabel={`Địa chỉ: ${info.address || "—"}`}
              />

              <CustomButton
                subtitle="Số điện thoại"
                title={info.phone || "—"}
                variant="secondary"
                onPress={() => links?.tel && Linking.openURL(links.tel)}
                disabled={!links?.tel}
                titleStyle={{ fontSize: 14, fontWeight: "600" }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                accessibilityLabel={`Gọi ${info.phone || ""}`}
              />

              <CustomButton
                subtitle="Email"
                title={info.email || "—"}
                variant="secondary"
                onPress={() => links?.mail && Linking.openURL(links.mail)}
                disabled={!links?.mail}
                titleStyle={{ fontSize: 14, fontWeight: "600" }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                accessibilityLabel={`Email ${info.email || ""}`}
              />

              <View className="rounded-2xl p-4" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-xs" style={{ color: colors.mutedText }}>
                  Giờ mở cửa
                </Text>
                <Text className="mt-1 text-sm font-semibold" style={{ color: colors.text }}>
                  {info.openingHours || "8:00 - 19:00, Thứ 2 - Thứ 7"}
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {links?.facebook ? (
                  <CustomButton
                    title="Facebook"
                    variant="secondary"
                    onPress={() => Linking.openURL(links.facebook!)}
                    titleStyle={{ fontSize: 14, fontWeight: "600" }}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                ) : null}
                {links?.instagram ? (
                  <CustomButton
                    title="Instagram"
                    variant="secondary"
                    onPress={() => Linking.openURL(links.instagram!)}
                    titleStyle={{ fontSize: 14, fontWeight: "600" }}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                ) : null}
                {links?.x ? (
                  <CustomButton
                    title="X"
                    variant="secondary"
                    onPress={() => Linking.openURL(links.x!)}
                    titleStyle={{ fontSize: 14, fontWeight: "600" }}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                ) : null}
                {links?.snapchat ? (
                  <CustomButton
                    title="Snapchat"
                    variant="secondary"
                    onPress={() => Linking.openURL(links.snapchat!)}
                    titleStyle={{ fontSize: 14, fontWeight: "600" }}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
        </View>

        <View className="mt-4 rounded-2xl p-4" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-[18px] font-semibold" style={{ color: colors.text }}>
            Gửi tin nhắn
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
            Vui lòng gửi câu hỏi trong biểu mẫu bên dưới, chúng tôi sẽ phản hồi sớm.
          </Text>

          <View className="mt-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Tên của bạn*"
                  placeholder="Nhập tên"
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
                  label="Email của bạn*"
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  autoCapitalize="none"
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
              name="message"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Tin nhắn*"
                  placeholder="Nhập nội dung"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.message?.message}
                  multiline
                  numberOfLines={5}
                  style={{ minHeight: 120, textAlignVertical: "top" } as any}
                />
              )}
            />

            {m.isSuccess ? (
              <Text className="mt-3 text-sm" style={{ color: "#16A34A" }}>
                Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.
              </Text>
            ) : null}
            {m.error ? (
              <Text className="mt-3 text-sm" style={{ color: colors.danger }}>
                {(m.error as any)?.message || "Gửi thất bại, vui lòng thử lại."}
              </Text>
            ) : null}

            <View className="mt-5">
              <CustomButton title={m.isPending ? "Đang gửi..." : "Gửi"} onPress={handleSubmit((v: FormValues) => m.mutateAsync(v))} loading={m.isPending} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
