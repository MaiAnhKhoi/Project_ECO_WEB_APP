import "@/global.css";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

import { AppScreenShell } from "@/components/layout";
import { SimpleScreenHeader } from "@/components/navigation/SimpleScreenHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { getMyReviews } from "@/services/reviewService";
import { useAuthStore } from "@/store/authStore";
import type { ReviewResponse } from "@/types/review";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { navLockRun } from "@/utils/navLock";

function statusLabel(status: string): string {
  if (status === "approved") return "Đã duyệt";
  if (status === "pending") return "Chờ duyệt";
  if (status === "rejected") return "Đã từ chối";
  return status;
}

function statusColor(status: string): string {
  if (status === "approved") return "bg-emerald-600";
  if (status === "pending") return "bg-amber-500";
  if (status === "rejected") return "bg-red-600";
  return "bg-neutral-500";
}

export default function MyReviewsScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setReviews([]);
      setLoading(false);
      return;
    }
    const list = await getMyReviews(token);
    setReviews(list);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await load();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const handleBack = () => navLockRun(() => router.back());

  const headerSubtitle =
    token && reviews.length > 0 ? `${reviews.length} đánh giá` : undefined;

  if (!token) {
    return (
      <AppScreenShell
        header={
          <SimpleScreenHeader title="Đánh giá của tôi" onBack={handleBack} />
        }
      >
        <EmptyStateBlock
          iconName="star"
          sectionLabel="Đánh giá"
          title="Đăng nhập để xem đánh giá"
          description="Xem và quản lý các đánh giá bạn đã gửi sau khi mua hàng."
          action={{
            label: "Đăng nhập",
            onPress: () =>
              navLockRun(() =>
                router.push({ pathname: "/auth/login", params: { next: "/my-reviews" } } as any),
              ),
          }}
        />
      </AppScreenShell>
    );
  }

  return (
    <AppScreenShell
      header={
        <SimpleScreenHeader
          title="Đánh giá của tôi"
          subtitle={headerSubtitle}
          onBack={handleBack}
        />
      }
    >
      {loading && reviews.length === 0 ? (
        <View className="flex-1">
          <LoadingSpinner
            visible
            message="Đang tải…"
            fullscreen={false}
            style={{ flex: 1, justifyContent: "center" }}
          />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <EmptyStateBlock
              iconName="star"
              sectionLabel="Đánh giá"
              title="Chưa có đánh giá nào"
              description="Mua và nhận hàng (đơn hoàn thành), sau đó đánh giá từ trang sản phẩm."
              action={{
                label: "Khám phá cửa hàng",
                onPress: () => navLockRun(() => router.push("/(tabs)/shop" as any)),
              }}
            />
          }
          renderItem={({ item }) => {
            const thumb = item.imageUrls?.[0]
              ? resolveAssetUrl(item.imageUrls[0]) ?? item.imageUrls[0]
              : null;
            return (
              <View
                className="mb-3 rounded-2xl bg-white p-4 dark:bg-neutral-900"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <View className="flex-row gap-3">
                  {thumb ? (
                    <Image
                      source={{ uri: thumb }}
                      style={{ width: 64, height: 64, borderRadius: 12 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      className="h-16 w-16 items-center justify-center rounded-xl"
                      style={{ backgroundColor: colors.surfaceMuted }}
                    >
                      <AppIcon name="image" size={28} color={colors.mutedText} />
                    </View>
                  )}
                  <View className="flex-1">
                    <CustomButton
                      title={`Sản phẩm #${item.productId}`}
                      variant="secondary"
                      onPress={() =>
                        navLockRun(() => router.push(`/product/${item.productId}` as any))
                      }
                      style={{ borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }}
                      accessibilityLabel="Mở sản phẩm"
                    />
                    <View className="mt-1 flex-row flex-wrap items-center gap-2">
                      <View className={`rounded-full px-2 py-0.5 ${statusColor(item.status)}`}>
                        <Text className="text-[10px] font-semibold text-white">
                          {statusLabel(item.status)}
                        </Text>
                      </View>
                      <Text className="text-xs" style={{ color: colors.mutedText }}>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </Text>
                    </View>
                    <View className="mt-1 flex-row">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <AppIcon key={i} name="star" size={14} color="#F59E0B" />
                      ))}
                    </View>
                  </View>
                </View>
                {item.content ? (
                  <Text
                    className="mt-2 text-sm"
                    style={{ color: colors.text }}
                    numberOfLines={3}
                  >
                    {item.content}
                  </Text>
                ) : null}
                <View className="mt-3 self-end">
                  <CustomButton
                    title="Xem chi tiết"
                    variant="secondary"
                    onPress={() => navLockRun(() => router.push(`/review/${item.id}` as any))}
                    style={{ borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 }}
                    accessibilityLabel="Xem chi tiết đánh giá"
                  />
                </View>
              </View>
            );
          }}
        />
      )}
    </AppScreenShell>
  );
}
