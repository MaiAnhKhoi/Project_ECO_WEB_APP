import "@/global.css";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { getReviewDetail } from "@/services/reviewService";
import { useAuthStore } from "@/store/authStore";
import type { ReviewResponse } from "@/types/review";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { navLockRun } from "@/utils/navLock";

function StarRow({ value }: { value: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <AppIcon
          key={i}
          name="star"
          size={18}
          color={i < value ? "#F59E0B" : "#D1D5DB"}
        />
      ))}
    </View>
  );
}

function statusLabel(status: string): string {
  if (status === "approved") return "Đã duyệt";
  if (status === "pending") return "Chờ duyệt";
  if (status === "rejected") return "Đã từ chối";
  return status;
}

export default function ReviewDetailScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const reviewId = Number(params.id);
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(reviewId)) {
      setError("Thiếu mã đánh giá.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getReviewDetail(reviewId, token)
      .then(setReview)
      .catch((e: any) => setError(e?.message || "Không tải được đánh giá."))
      .finally(() => setLoading(false));
  }, [reviewId, token]);

  const isOwner = user && review && user.id === review.userId;

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-950" edges={["top"]}>
      <View className="border-b border-black/10 px-4 pb-2 pt-2 dark:border-white/10">
        <View className="flex-row items-center">
          <CustomIconButton
            onPress={() => navLockRun(() => router.back())}
            accessibilityLabel="Quay lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <Text className="ml-2 flex-1 text-base font-semibold" style={{ color: colors.text }}>
            Chi tiết đánh giá
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1">
          <LoadingSpinner
            visible
            message="Đang tải…"
            fullscreen={false}
            style={{ flex: 1, justifyContent: "center" }}
          />
        </View>
      ) : null}

      {!loading && (error || !review) ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-app-fg dark:text-neutral-200">
            {error || "Không tìm thấy đánh giá."}
          </Text>
          <View className="mt-6 w-full max-w-[280px]">
            <CustomButton title="Quay lại" onPress={() => navLockRun(() => router.back())} />
          </View>
        </View>
      ) : null}

      {!loading && review ? (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="mt-4 flex-row flex-wrap items-center gap-2">
            <View
              className={`rounded-full px-2.5 py-1 ${
                review.status === "approved"
                  ? "bg-emerald-600"
                  : review.status === "pending"
                    ? "bg-amber-500"
                    : review.status === "rejected"
                      ? "bg-red-600"
                      : "bg-neutral-500"
              }`}
            >
              <Text className="text-xs font-semibold text-white">{statusLabel(review.status)}</Text>
            </View>
            {isOwner ? (
              <Text className="text-xs font-medium text-primary">Đánh giá của bạn</Text>
            ) : null}
          </View>
          <Text className="mt-2 text-xs text-app-muted dark:text-neutral-400">
            {new Date(review.createdAt).toLocaleString("vi-VN")}
          </Text>

          <View className="mt-4 max-w-[320px]">
            <CustomButton
              title={`Xem sản phẩm #${review.productId}`}
              variant="secondary"
              onPress={() => navLockRun(() => router.push(`/product/${review.productId}` as any))}
              accessibilityLabel="Xem sản phẩm"
            />
          </View>

          <View className="mt-6 rounded-2xl bg-white p-4 dark:bg-neutral-900">
            <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">Điểm</Text>
            <View className="mt-2 flex-row items-center gap-2">
              <StarRow value={review.rating} />
              <Text className="font-bold text-app-fg dark:text-neutral-100">{review.rating}/5</Text>
            </View>
            {review.content ? (
              <>
                <Text className="mt-4 text-sm font-semibold text-app-fg dark:text-neutral-100">Nội dung</Text>
                <Text className="mt-1 text-sm leading-6 text-app-fg dark:text-neutral-200">{review.content}</Text>
              </>
            ) : null}
          </View>

          <View className="mt-4 rounded-2xl bg-white p-4 dark:bg-neutral-900">
            <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">Người đánh giá</Text>
            <View className="mt-3 flex-row items-center gap-3">
              {(() => {
                const avatarUri = resolveAssetUrl(review.userAvatar);
                return avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                  />
                ) : (
                  <Avatar name={review.userName || "?"} size={48} />
                );
              })()}
              <View>
                <Text className="font-semibold text-app-fg dark:text-neutral-100">{review.userName}</Text>
                <Text className="text-xs text-app-muted dark:text-neutral-400">ID #{review.userId}</Text>
              </View>
            </View>
          </View>

          {review.imageUrls?.length ? (
            <View className="mt-4">
              <Text className="mb-2 text-sm font-semibold text-app-fg dark:text-neutral-100">Ảnh đính kèm</Text>
              <View className="flex-row flex-wrap gap-2">
                {review.imageUrls.map((url, idx) => {
                  const u = resolveAssetUrl(url) ?? url;
                  return (
                    <Image
                      key={`${url}-${idx}`}
                      source={{ uri: u }}
                      style={{ width: 100, height: 100, borderRadius: 12 }}
                      contentFit="cover"
                    />
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
