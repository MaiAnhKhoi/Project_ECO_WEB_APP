import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import "@/global.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AppScreenShell } from "@/components/layout";
import { SimpleScreenHeader } from "@/components/navigation/SimpleScreenHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAsideStore } from "@/store/asideStore";
import { addressApi, type AddressResponse } from "@/services/addressApi";
import { useAuthStore } from "@/store/authStore";
import { navLockRun } from "@/utils/navLock";

export default function AddressesScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const openAside = useAsideStore((s) => s.openAside);
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ from?: string }>();

  const redirectedRef = useRef(false);
  useEffect(() => {
    if (user) return;
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    navLockRun(() =>
      router.push({ pathname: "/auth/login", params: { next: "/addresses" } } as any),
    );
  }, [user, router]);

  const q = useQuery({
    queryKey: ["myAddresses"],
    queryFn: async () => addressApi.getMyAddresses(token!),
    enabled: !!token,
  });

  const list = q.data ?? [];
  const defaultAddress = useMemo(() => list.find((a) => a.isDefault) ?? null, [list]);
  const [busyId, setBusyId] = useState<number | null>(null);

  const setDefaultM = useMutation({
    mutationFn: async (id: number) => addressApi.setDefault(token!, id),
    onMutate: async (id) => {
      setBusyId(id);
      await qc.cancelQueries({ queryKey: ["myAddresses"] });
      const prev = qc.getQueryData<AddressResponse[]>(["myAddresses"]);
      if (prev) {
        qc.setQueryData<AddressResponse[]>(
          ["myAddresses"],
          prev.map((a) => ({ ...a, isDefault: a.id === id })),
        );
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["myAddresses"], ctx.prev);
    },
    onSettled: () => {
      setBusyId(null);
      qc.invalidateQueries({ queryKey: ["myAddresses"] });
    },
  });

  const deleteM = useMutation({
    mutationFn: async (id: number) => addressApi.deleteAddress(token!, id),
    onMutate: async (id) => {
      setBusyId(id);
      await qc.cancelQueries({ queryKey: ["myAddresses"] });
      const prev = qc.getQueryData<AddressResponse[]>(["myAddresses"]);
      if (prev) qc.setQueryData<AddressResponse[]>(["myAddresses"], prev.filter((a) => a.id !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["myAddresses"], ctx.prev);
    },
    onSettled: () => {
      setBusyId(null);
      qc.invalidateQueries({ queryKey: ["myAddresses"] });
    },
  });

  const handleBack = () => {
    if (params?.from === "aside") {
      navLockRun(() => {
        router.back();
        setTimeout(() => openAside(), 0);
      });
      return;
    }
    navLockRun(() => router.back());
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Xoá địa chỉ", "Bạn có chắc muốn xoá địa chỉ này không?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => deleteM.mutate(id) },
    ]);
  };

  if (!user) return null;

  const goNewAddress = () => navLockRun(() => router.push("/addresses/new" as any));

  return (
    <View className="flex-1">
      <LoadingSpinner
        visible={q.isFetching || setDefaultM.isPending || deleteM.isPending}
        message="Đang xử lý…"
        fullscreen
      />

      <AppScreenShell
        header={
          <SimpleScreenHeader
            title="Địa chỉ của tôi"
            onBack={handleBack}
            right={
              <CustomIconButton onPress={goNewAddress} accessibilityLabel="Thêm địa chỉ">
                <AppIcon name="plus" size={22} color={colors.text} />
              </CustomIconButton>
            }
          />
        }
      >
        {q.isPending && !q.data ? (
          <View className="flex-1">
            <LoadingSpinner
              visible
              message="Đang tải…"
              fullscreen={false}
              style={{ flex: 1, justifyContent: "center" }}
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {q.error ? (
              <View
                className="mt-4 rounded-2xl p-4"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <Text style={{ color: colors.text }} className="text-sm font-semibold">
                  Không thể tải danh sách địa chỉ
                </Text>
                <Text style={{ color: colors.mutedText }} className="mt-1 text-sm">
                  {(q.error as Error)?.message || "Vui lòng thử lại."}
                </Text>
                <View className="mt-4">
                  <CustomButton title="Tải lại" onPress={() => q.refetch()} />
                </View>
              </View>
            ) : null}

            {!q.isFetching && !q.error && list.length === 0 ? (
              <EmptyStateBlock
                iconName="map-pin"
                sectionLabel="Địa chỉ"
                title="Bạn chưa có địa chỉ nào"
                description="Thêm địa chỉ để thanh toán và giao hàng thuận tiện hơn."
                action={{ label: "Thêm địa chỉ", onPress: goNewAddress }}
              />
            ) : null}

            {list.map((a) => {
              const isBusy = busyId === a.id;
              return (
                <View
                  key={a.id}
                  className="mt-4 rounded-2xl bg-white p-4 dark:bg-neutral-900"
                  style={{ borderWidth: 1, borderColor: colors.border }}
                >
                  <View className="flex-row items-start justify-between">
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <View className="flex-row items-center">
                        <Text className="text-base font-semibold" style={{ color: colors.text }}>
                          {a.firstName} {a.lastName}
                        </Text>
                        {a.isDefault ? (
                          <View
                            className="ml-2 rounded-full px-2 py-1"
                            style={{ backgroundColor: `${colors.tint}22` }}
                          >
                            <Text style={{ color: colors.tint }} className="text-[12px] font-semibold">
                              Mặc định
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                        {a.phone}
                      </Text>
                      <Text className="mt-2 text-sm" style={{ color: colors.text }}>
                        {a.address1}
                      </Text>
                      <Text className="mt-1 text-sm" style={{ color: colors.text }}>
                        {a.city}
                        {a.province ? `, ${a.province}` : ""} — {a.region}
                      </Text>
                      {a.company ? (
                        <Text className="mt-1 text-sm" style={{ color: colors.mutedText }}>
                          Công ty: {a.company}
                        </Text>
                      ) : null}
                    </View>

                    <CustomIconButton
                      onPress={() => navLockRun(() => router.push(`/addresses/${a.id}` as any))}
                      accessibilityLabel="Sửa địa chỉ"
                      size={40}
                    >
                      <AppIcon name="edit-2" size={20} color={colors.mutedText} />
                    </CustomIconButton>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <Pressable
                      disabled={a.isDefault || isBusy}
                      onPress={() => setDefaultM.mutate(a.id)}
                      className="flex-row items-center active:opacity-80"
                      accessibilityRole="button"
                      accessibilityLabel="Đặt làm mặc định"
                    >
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: a.isDefault ? colors.tint : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: a.isDefault ? 1 : 0.9,
                        }}
                      >
                        {a.isDefault ? <AppIcon name="check" size={12} color="#fff" /> : null}
                      </View>
                      <Text
                        className="ml-3 text-sm"
                        style={{ color: a.isDefault ? colors.mutedText : colors.text }}
                      >
                        {a.isDefault ? "Đang là mặc định" : "Đặt làm mặc định"}
                      </Text>
                    </Pressable>

                    <CustomButton
                      title="Xoá"
                      variant="secondary"
                      disabled={isBusy || (defaultAddress?.id === a.id && list.length > 1)}
                      onPress={() => confirmDelete(a.id)}
                      titleColor="#DC2626"
                      titleStyle={{ fontSize: 14, fontWeight: "600" }}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 12,
                        backgroundColor: "transparent",
                      }}
                      accessibilityLabel="Xoá địa chỉ"
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </AppScreenShell>
    </View>
  );
}
