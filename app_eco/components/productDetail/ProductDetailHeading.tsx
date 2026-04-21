import React from "react";
import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";
import { cn } from "@/utils/cn";

type Props = {
  product: Product;
};

function StarRow({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i === full && hasHalf) return "half";
    return "empty";
  });
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-0.5">
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
      <Text className="text-xs text-app-muted dark:text-neutral-400">
        {rating.toFixed(1)} ({count})
      </Text>
    </View>
  );
}

export function ProductDetailHeading({ product }: Props) {
  const colors = useAppColors();
  const brand = product.filterBrands?.[0];
  const inStock = product.inStock ?? false;
  const showSale = product.oldPrice != null && product.oldPrice > product.price;
  const discountPct =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <View className="px-4 pt-1">
      {brand ? (
        <View
          className="mb-2 self-start rounded-md px-2 py-0.5"
          style={{ backgroundColor: `${colors.tint}22` }}
        >
          <Text
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: colors.tint }}
          >
            {brand}
          </Text>
        </View>
      ) : null}

      <Text className="text-xl font-bold leading-7 text-app-fg dark:text-neutral-100">
        {product.title}
      </Text>

      {(product as any).averageRating != null ? (
        <View className="mt-1.5">
          <StarRow
            rating={(product as any).averageRating}
            count={(product as any).totalReviews ?? 0}
          />
        </View>
      ) : null}

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-[26px] font-extrabold" style={{ color: colors.tint }}>
          {product.price.toLocaleString("vi-VN")}₫
        </Text>
        {showSale && product.oldPrice != null ? (
          <Text className="text-base line-through text-app-muted dark:text-neutral-500">
            {product.oldPrice.toLocaleString("vi-VN")}₫
          </Text>
        ) : null}
        {discountPct ? (
          <View className="rounded-md bg-red-600 px-1.5 py-0.5">
            <Text className="text-xs font-bold text-white">-{discountPct}%</Text>
          </View>
        ) : product.saleLabel ? (
          <View className="rounded-md bg-red-600 px-1.5 py-0.5">
            <Text className="text-xs font-bold text-white">{product.saleLabel}</Text>
          </View>
        ) : null}
      </View>

      <View className="mt-2.5 flex-row flex-wrap items-center gap-3">
        <View
          className={cn(
            "flex-row items-center gap-1 rounded-lg px-2.5 py-1",
            inStock ? "bg-green-50 dark:bg-green-950/40" : "bg-red-50 dark:bg-red-950/40"
          )}
        >
          <View
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              inStock ? "bg-app-success" : "bg-app-danger"
            )}
          />
          <Text
            className={cn(
              "text-[13px] font-semibold",
              inStock ? "text-app-success" : "text-app-danger"
            )}
          >
            {inStock ? "Còn hàng" : "Hết hàng"}
          </Text>
        </View>
        {product.sold != null && product.sold > 0 ? (
          <Text className="text-xs text-app-muted dark:text-neutral-400">
            🔥 {product.sold} đã bán (24h)
          </Text>
        ) : null}
      </View>

      {product.stockProgress != null &&
      product.stockProgress > 0 &&
      product.stockProgressPercent != null ? (
        <View className="mt-3.5 rounded-[10px] bg-orange-50 p-2.5 dark:bg-orange-950/30">
          <Text className="mb-1.5 text-xs text-amber-900 dark:text-amber-200">
            ⚡ <Text className="font-bold">NHANH LÊN!</Text> Chỉ còn{" "}
            <Text className="font-bold text-app-danger">{product.stockProgress}</Text> sản phẩm
          </Text>
          <View className="h-1.5 overflow-hidden rounded-full bg-orange-200 dark:bg-orange-900/50">
            <View
              className="h-full rounded-full bg-app-warning"
              style={{
                width: `${Math.min(100, Math.max(0, product.stockProgressPercent))}%`,
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
