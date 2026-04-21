import "@/global.css";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { useCompareStore } from "@/store/compareStore";
import type { Product } from "@/types/product";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { cn } from "@/utils/cn";

const LABEL_COL = 112;
const GAP = 12;

const ATTRS: { label: string; key: (p: Product) => string }[] = [
  { label: "Giá", key: (p) => `${p.price.toLocaleString("vi-VN")}₫` },
  {
    label: "Giá gốc",
    key: (p) => (p.oldPrice ? `${p.oldPrice.toLocaleString("vi-VN")}₫` : "—"),
  },
  {
    label: "Khuyến mãi",
    key: (p) => {
      if (!p.oldPrice || p.oldPrice <= p.price) return "—";
      const pct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      return `-${pct}%`;
    },
  },
  {
    label: "Tình trạng",
    key: (p) => (p.inStock ? "Còn hàng" : "Hết hàng"),
  },
  {
    label: "Thương hiệu",
    key: (p) => p.filterBrands?.[0] ?? "—",
  },
  {
    label: "Số màu",
    key: (p) => {
      const c = p.colors?.length ?? 0;
      return c > 0 ? `${c} màu` : "—";
    },
  },
  {
    label: "Số size",
    key: (p) => {
      const sizes = new Set<string>();
      p.colors?.forEach((c) => c.sizes?.forEach((s) => sizes.add(s.size)));
      return sizes.size > 0 ? `${sizes.size} size` : "—";
    },
  },
  {
    label: "Nhãn",
    key: (p) => p.saleLabel ?? "—",
  },
];

function isBestPrice(products: Product[], idx: number) {
  if (products.length < 2) return false;
  const prices = products.map((p) => p.price);
  return prices[idx] === Math.min(...prices);
}

function isInStock(p: Product) {
  return p.inStock ?? false;
}

export default function CompareScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();
  const products = useCompareStore((s) => s.products);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  const colW = useMemo(() => {
    const w = Math.floor((screenW - 24 - LABEL_COL) / 1.35);
    return Math.max(136, Math.min(188, w));
  }, [screenW]);

  const onRemove = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    remove(id);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-app-bg dark:bg-neutral-950"
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View className="border-b border-black/8 bg-white px-4 pb-3 pt-1 dark:border-white/10 dark:bg-neutral-900">
        <View className="flex-row items-center gap-2">
          <CustomIconButton onPress={() => router.back()} accessibilityLabel="Trở lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <View className="min-w-0 flex-1">
            <Text
              className="text-[19px] font-bold text-app-fg dark:text-neutral-100"
              numberOfLines={1}
            >
              So sánh sản phẩm
            </Text>
            {products.length > 0 ? (
              <Text className="mt-0.5 text-[13px] text-app-muted dark:text-neutral-400">
                {products.length} sản phẩm · vuốt ngang để xem thêm
              </Text>
            ) : (
              <Text className="mt-0.5 text-[13px] text-app-muted dark:text-neutral-400">
                Thêm sản phẩm từ trang chi tiết
              </Text>
            )}
          </View>
          {products.length > 0 ? (
            <CustomButton
              title="Xoá hết"
              variant="secondary"
              onPress={() => {
                Haptics.selectionAsync();
                clear();
              }}
              style={{ paddingVertical: 8, paddingHorizontal: 12 }}
              accessibilityLabel="Xoá hết sản phẩm so sánh"
            />
          ) : null}
        </View>
      </View>

      {products.length === 0 ? (
        <View className="flex-1 justify-center px-6">
          <View className="items-center rounded-3xl border border-black/6 bg-white px-6 py-10 dark:border-white/10 dark:bg-neutral-900">
            <View className="mb-5 h-20 w-20 items-center justify-center rounded-[22px] bg-primary/10 dark:bg-primary/20">
              <AppIcon name="grid" size={40} color={colors.tint} />
            </View>
            <Text className="text-center text-lg font-bold text-app-fg dark:text-neutral-100">
              Chưa có sản phẩm để so sánh
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-[22px] text-app-muted dark:text-neutral-400">
              Mở một sản phẩm bất kỳ, chọn &quot;Thêm sản phẩm này&quot; trong mục so sánh — bạn có thể thêm bao nhiêu cũng được.
            </Text>
            <View className="mt-7 w-full max-w-[280px]">
              <CustomButton
                title="Tiếp tục mua sắm"
                onPress={() => router.back()}
                style={{ borderRadius: 16, paddingVertical: 14 }}
              />
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            nestedScrollEnabled
            contentContainerStyle={{
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <View>
              {/* Hàng tiêu đề cột: nhãn + thẻ sản phẩm */}
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={{ width: LABEL_COL, paddingRight: 8, paddingTop: 4 }}
                  className="justify-start"
                >
                  <Text className="text-[11px] font-bold uppercase tracking-wide text-app-muted dark:text-neutral-500">
                    Sản phẩm
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: GAP }}>
                  {products.map((p, idx) => (
                    <View
                      key={p.id}
                      style={{ width: colW }}
                      className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900"
                    >
                      <View className="relative">
                        <View className="absolute right-2 top-2 z-10">
                          <CustomIconButton
                            onPress={() => onRemove(p.id)}
                            accessibilityLabel="Bỏ khỏi so sánh"
                            size={32}
                            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                          >
                            <AppIcon name="x" size={18} color="#fff" />
                          </CustomIconButton>
                        </View>
                        <Pressable onPress={() => router.push(`/product/${p.id}` as any)}>
                          <Image
                            source={{ uri: resolveAssetUrl(p.imgSrc) ?? p.imgSrc }}
                            style={{ width: colW, height: colW }}
                            contentFit="cover"
                            transition={200}
                          />
                        </Pressable>
                      </View>
                      <View className="border-t border-black/5 px-2.5 pb-3 pt-2 dark:border-white/10">
                        <Pressable onPress={() => router.push(`/product/${p.id}` as any)}>
                          <Text
                            numberOfLines={2}
                            className="text-[13px] font-semibold leading-[19px] text-app-fg dark:text-neutral-100"
                          >
                            {p.title}
                          </Text>
                        </Pressable>
                        <View className="mt-1.5 flex-row flex-wrap items-center gap-1">
                          <Text
                            className="text-[15px] font-extrabold"
                            style={{
                              color: isBestPrice(products, idx) ? "#16A34A" : colors.tint,
                            }}
                          >
                            {p.price.toLocaleString("vi-VN")}₫
                          </Text>
                          {isBestPrice(products, idx) && products.length > 1 ? (
                            <View className="rounded-md bg-green-100 px-1.5 py-0.5 dark:bg-green-950/60">
                              <Text className="text-[9px] font-bold uppercase text-green-700 dark:text-green-400">
                                Rẻ nhất
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <View className="mt-2.5">
                          <CustomButton
                            title="Xem chi tiết"
                            variant="secondary"
                            onPress={() => router.push(`/product/${p.id}` as any)}
                            titleStyle={{ fontSize: 12, fontWeight: "700" }}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderRadius: 12,
                              backgroundColor: colors.surfaceMuted,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Bảng đặc điểm */}
              <View style={{ marginTop: 22, marginBottom: 6, marginLeft: 0, flexDirection: "row" }}>
                <View style={{ width: LABEL_COL, paddingRight: 8 }}>
                  <Text className="text-[11px] font-bold uppercase tracking-wide text-app-muted dark:text-neutral-500">
                    Đặc điểm
                  </Text>
                </View>
              </View>

              <View>
                {ATTRS.map((attr, attrIdx) => (
                  <View
                    key={attr.label}
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{ width: LABEL_COL, paddingRight: 8, paddingVertical: 10 }}
                      className="justify-center"
                    >
                      <Text className="text-[12px] font-semibold leading-4 text-app-muted dark:text-neutral-400">
                        {attr.label}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: GAP }}>
                      {products.map((p, idx) => {
                        const val = attr.key(p);
                        const isPrice = attr.label === "Giá";
                        const isStock = attr.label === "Tình trạng";
                        const bestP = isPrice && isBestPrice(products, idx);
                        const stockOk = isStock && isInStock(p);

                        return (
                          <View
                            key={p.id}
                            style={{ width: colW }}
                            className={cn(
                              "justify-center rounded-xl border border-black/5 px-2.5 py-2.5 dark:border-white/10",
                              attrIdx % 2 === 0
                                ? "bg-white dark:bg-neutral-900"
                                : "bg-neutral-50 dark:bg-neutral-800/90"
                            )}
                          >
                            <Text
                              className={cn(
                                "text-[13px] leading-[18px]",
                                isPrice || isStock ? "font-bold" : "font-medium"
                              )}
                              numberOfLines={3}
                              style={{
                                color: bestP
                                  ? "#16A34A"
                                  : isStock
                                    ? stockOk
                                      ? "#16A34A"
                                      : "#DC2626"
                                    : colors.text,
                              }}
                            >
                              {val}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="mt-2 px-4">
            <CustomButton
              title="Thêm sản phẩm khác"
              variant="secondary"
              onPress={() => router.back()}
              style={{
                borderRadius: 16,
                paddingVertical: 14,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor:
                  colors.scheme === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
              }}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
