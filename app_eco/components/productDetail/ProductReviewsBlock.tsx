import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { createReview, getProductReviews, getReviewEligibility } from "@/services/reviewService";
import type { ProductTabsResponse } from "@/types/productDetail";
import type { ReviewEligibility, ReviewResponse } from "@/types/review";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { cn } from "@/utils/cn";
import { compressImageToJpeg } from "@/utils/tryOnModelImage";

const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i === full && hasHalf) return "half";
    return "empty";
  });
  return (
    <View className="flex-row gap-0.5">
      {stars.map((s, i) => (
        <AppIcon
          key={i}
          name="star"
          size={14}
          color={s === "empty" ? "#D1D5DB" : "#F59E0B"}
          style={s === "half" ? { opacity: 0.55 } : undefined}
        />
      ))}
    </View>
  );
}

function RatingBar({
  rating,
  count,
  total,
}: {
  rating: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View className="mt-1.5 flex-row items-center gap-2">
      <View className="w-7 flex-row items-center gap-0.5">
        <Text className="text-xs font-semibold text-app-muted dark:text-neutral-400">{rating}</Text>
        <AppIcon name="star" size={11} color="#F59E0B" />
      </View>
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-app-surface dark:bg-neutral-800">
        <View className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
      </View>
      <Text className="w-[22px] text-right text-xs text-app-muted dark:text-neutral-400">{count}</Text>
    </View>
  );
}

function statusBadgeClass(status: string): string {
  if (status === "approved") return "bg-emerald-600";
  if (status === "pending") return "bg-amber-500";
  if (status === "rejected") return "bg-red-600";
  return "bg-neutral-500";
}

function statusLabel(status: string): string {
  if (status === "approved") return "Đã duyệt";
  if (status === "pending") return "Chờ duyệt";
  if (status === "rejected") return "Đã từ chối";
  return status;
}

type Props = {
  productId: number;
  token: string | null;
  user: { name?: string | null; email?: string | null } | null;
  tabsReviews: ProductTabsResponse["reviews"] | null;
};

export function ProductReviewsBlock({ productId, token, user, tabsReviews }: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [imageItems, setImageItems] = useState<{ uri: string; name: string; type: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);

  const isLoggedIn = Boolean(token);

  const loadReviews = useCallback(async () => {
    setLoadingList(true);
    try {
      const list = await getProductReviews(productId);
      setReviews(list);
    } catch {
      setReviews([]);
    } finally {
      setLoadingList(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (!token) {
      setEligibility(null);
      return;
    }
    getReviewEligibility(productId, token)
      .then(setEligibility)
      .catch(() => setEligibility(null));
  }, [productId, token]);

  const summary = useMemo(() => {
    if (tabsReviews?.summary) {
      return {
        averageRating: tabsReviews.summary.averageRating,
        totalReviews: tabsReviews.summary.totalReviews,
        breakdown: tabsReviews.summary.breakdown,
      };
    }
    const total = reviews.length;
    const averageRating =
      total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    return {
      averageRating,
      totalReviews: total,
      breakdown: Array.from({ length: 5 }, (_, i) => ({
        rating: 5 - i,
        count: reviews.filter((r) => r.rating === 5 - i).length,
      })),
    };
  }, [tabsReviews, reviews]);

  const addImages = useCallback(async () => {
    if (imageItems.length >= MAX_IMAGES) {
      Alert.alert("Giới hạn", `Tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Quyền truy cập", "Cần quyền thư viện ảnh để đính kèm hình.");
      return;
    }
    setPicking(true);
    try {
      const remain = MAX_IMAGES - imageItems.length;
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remain,
        quality: 0.9,
      });
      if (res.canceled || !res.assets?.length) return;

      const next: { uri: string; name: string; type: string }[] = [...imageItems];
      for (const asset of res.assets) {
        if (next.length >= MAX_IMAGES) break;
        if (asset.fileSize != null && asset.fileSize > MAX_BYTES) {
          Alert.alert("Ảnh quá lớn", "Mỗi ảnh tối đa 5MB.");
          continue;
        }
        const jpeg = await compressImageToJpeg(asset.uri);
        next.push({ uri: jpeg.uri, name: jpeg.fileName, type: jpeg.mimeType });
      }
      setImageItems(next);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message || "Không thêm được ảnh.");
    } finally {
      setPicking(false);
    }
  }, [imageItems]);

  const removeImageAt = useCallback((index: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const submit = useCallback(async () => {
    if (!token) {
      Alert.alert("Đăng nhập", "Vui lòng đăng nhập để đánh giá.");
      return;
    }
    if (rating < 1 || rating > 5) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao (1–5).");
      return;
    }
    const text = content.trim();
    if (!text) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập nội dung đánh giá.");
      return;
    }
    if (text.length > 2000) {
      Alert.alert("Quá dài", "Nội dung tối đa 2000 ký tự.");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(
        token,
        { productId, rating, content: text },
        imageItems
      );
      Alert.alert("Thành công", "Đánh giá đã được gửi.");
      setRating(0);
      setContent("");
      setImageItems([]);
      try {
        const next = await getReviewEligibility(productId, token);
        setEligibility(next);
      } catch {
        setEligibility(null);
      }
      await loadReviews();
    } catch (e: any) {
      Alert.alert("Không gửi được", e?.message || "Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  }, [token, rating, content, productId, imageItems, loadReviews]);

  const chipButtonStyle = { borderRadius: 12 as const, paddingVertical: 10 as const, paddingHorizontal: 14 as const };

  return (
    <View>
      <LoadingSpinner visible={loadingList} message="Đang tải đánh giá…" fullscreen={false} />

      <View className="mb-3.5 rounded-[14px] bg-app-surface p-3.5 dark:bg-neutral-800/80">
        <View className="flex-row items-start gap-4">
          <View className="items-center">
            <Text className="text-[42px] font-extrabold leading-[48px] text-app-fg dark:text-neutral-100">
              {summary.averageRating.toFixed(1)}
            </Text>
            <StarRow value={summary.averageRating} />
            <Text className="mt-1 text-[11px] text-app-muted dark:text-neutral-400">
              {summary.totalReviews} đánh giá
            </Text>
          </View>
          <View className="flex-1">
            {summary.breakdown
              .slice()
              .reverse()
              .map((b) => (
                <RatingBar
                  key={b.rating}
                  rating={b.rating}
                  count={b.count}
                  total={summary.totalReviews}
                />
              ))}
          </View>
        </View>
      </View>

      {isLoggedIn && eligibility && !eligibility.canReview ? (
        <Text className="mb-3 text-sm text-app-muted dark:text-neutral-400">
          {eligibility.completedPurchaseCount === 0
            ? "Bạn cần mua và nhận hàng (đơn ở trạng thái hoàn thành) trước khi được đánh giá sản phẩm này."
            : "Bạn đã gửi đủ số lần đánh giá tương ứng với số lần mua đã hoàn thành cho sản phẩm này."}
        </Text>
      ) : null}

      {!loadingList && reviews.length === 0 ? (
        <View className="items-center py-4">
          <AppIcon name="message-circle" size={32} color={colors.mutedText} />
          <Text className="mt-2 text-sm text-app-muted dark:text-neutral-400">
            Chưa có đánh giá nào.
          </Text>
        </View>
      ) : null}

      {!loadingList && reviews.length > 0 ? (
        <View className="mb-4">
          {reviews.map((review, i) => (
            <View
              key={review.id}
              className={cn(
                "mb-3.5 pb-3.5",
                i < reviews.length - 1 && "border-b border-black/5 dark:border-white/10"
              )}
            >
              <View className="flex-row items-start gap-2.5">
                {(() => {
                  const avatarUri = resolveAssetUrl(review.userAvatar);
                  return avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={{ width: 38, height: 38, borderRadius: 19 }}
                      contentFit="cover"
                    />
                  ) : (
                    <Avatar name={review.userName || "?"} size={38} />
                  );
                })()}
                <View className="flex-1">
                  <View className="flex-row flex-wrap items-center justify-between gap-2">
                    <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">
                      {review.userName}
                    </Text>
                    <Text className="text-[11px] text-app-muted dark:text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                  <View className="mt-1">
                    <StarRow value={review.rating} />
                  </View>
                  <View className="mt-1.5 flex-row flex-wrap items-center gap-2">
                    <View className={cn("rounded-full px-2 py-0.5", statusBadgeClass(review.status))}>
                      <Text className="text-[10px] font-semibold text-white">
                        {statusLabel(review.status)}
                      </Text>
                    </View>
                    <CustomButton
                      title="Xem chi tiết"
                      variant="secondary"
                      onPress={() => router.push(`/review/${review.id}` as any)}
                      style={chipButtonStyle}
                      accessibilityLabel="Xem chi tiết đánh giá"
                    />
                  </View>
                </View>
              </View>
              {review.content ? (
                <Text className="mt-2 text-sm leading-[22px] text-app-fg dark:text-neutral-100">
                  {review.content}
                </Text>
              ) : null}
              {review.imageUrls?.length ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                  <View className="flex-row gap-2">
                    {review.imageUrls.map((url, idx) => {
                      const u = resolveAssetUrl(url) ?? url;
                      return (
                        <Image
                          key={`${url}-${idx}`}
                          source={{ uri: u }}
                          style={{ width: 96, height: 96, borderRadius: 10 }}
                          contentFit="cover"
                        />
                      );
                    })}
                  </View>
                </ScrollView>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {isLoggedIn && eligibility?.canReview ? (
        <View className="rounded-[14px] border border-black/10 bg-white p-3.5 dark:border-white/10 dark:bg-neutral-900">
          <Text className="text-[15px] font-semibold text-app-fg dark:text-neutral-100">
            Viết đánh giá
          </Text>
          {user?.name ? (
            <Text className="mt-1 text-xs text-app-muted dark:text-neutral-400">
              {user.email ? `${user.name} · ${user.email}` : user.name}
            </Text>
          ) : null}
          <Text className="mb-2 mt-3 text-xs font-medium text-app-muted dark:text-neutral-400">
            Số sao *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <CustomButton
                key={star}
                title={`${star} sao`}
                variant={rating === star ? "primary" : "secondary"}
                onPress={() => setRating(star)}
                style={chipButtonStyle}
                accessibilityLabel={`Chọn ${star} sao`}
              />
            ))}
          </View>
          <View className="mt-3">
            <CustomInput
              label="Nội dung *"
              value={content}
              onChangeText={setContent}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />
          </View>
          <Text className="mb-1 mt-3 text-xs font-medium text-app-muted dark:text-neutral-400">
            Ảnh (tối đa {MAX_IMAGES}, mỗi ảnh &lt; 5MB)
          </Text>
          <CustomButton
            title={
              imageItems.length >= MAX_IMAGES
                ? "Đã đủ số ảnh"
                : "Thêm ảnh từ thư viện"
            }
            variant="secondary"
            onPress={addImages}
            loading={picking}
            disabled={imageItems.length >= MAX_IMAGES}
            accessibilityLabel="Thêm ảnh đánh giá"
          />
          {imageItems.length > 0 ? (
            <ScrollView horizontal className="mb-3 mt-2">
              <View className="flex-row gap-2">
                {imageItems.map((img, idx) => (
                  <View key={`${img.uri}-${idx}`} className="relative">
                    <Image
                      source={{ uri: img.uri }}
                      style={{ width: 72, height: 72, borderRadius: 10 }}
                      contentFit="cover"
                    />
                    <View className="absolute -right-1 -top-1">
                      <CustomIconButton
                        onPress={() => removeImageAt(idx)}
                        accessibilityLabel="Xóa ảnh"
                        size={28}
                      >
                        <AppIcon name="trash-2" size={16} color={colors.danger} />
                      </CustomIconButton>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : null}
          <CustomButton
            title="Gửi đánh giá"
            onPress={submit}
            loading={submitting}
            disabled={submitting}
            accessibilityLabel="Gửi đánh giá"
          />
          <Text className="mt-2 text-[11px] leading-4 text-app-muted dark:text-neutral-500">
            Chỉ khách đã mua và nhận hàng (đơn hoàn thành) mới được đánh giá; mỗi lần mua hoàn thành
            tương ứng một lần gửi.
          </Text>
        </View>
      ) : null}

      {!isLoggedIn ? (
        <View className="mt-2 items-center rounded-[14px] bg-app-surface py-5 dark:bg-neutral-800/80">
          <Text className="text-sm text-app-muted dark:text-neutral-400">
            Đăng nhập để đánh giá sản phẩm.
          </Text>
          <View className="mt-3 w-full max-w-[280px]">
            <CustomButton
              title="Đăng nhập"
              onPress={() =>
                router.push({
                  pathname: "/auth/login",
                  params: { next: `/product/${productId}` },
                } as any)
              }
              accessibilityLabel="Đăng nhập để đánh giá"
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
