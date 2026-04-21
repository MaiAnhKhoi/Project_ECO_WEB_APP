import React from "react";
import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { ProductTabsResponse } from "@/types/productDetail";
import { cn } from "@/utils/cn";

import { ProductAccordion } from "./ProductAccordion";
import { ProductReviewsBlock } from "./ProductReviewsBlock";

type Props = {
  tabs: ProductTabsResponse | null;
  productId: number | null;
  token: string | null;
  user: { name?: string | null; email?: string | null } | null;
};

export function ProductDetailInfoSections({ tabs, productId, token, user }: Props) {
  const colors = useAppColors();

  if (!tabs) {
    return (
      <View className="px-4 pb-4 pt-2">
        <Text className="text-sm text-app-muted dark:text-neutral-400">
          Đang tải thông tin chi tiết...
        </Text>
      </View>
    );
  }

  const desc = tabs.description;
  const mats = tabs.materials;
  const add = tabs.additionalInfo ?? [];
  const rev = tabs.reviews;
  const totalReviews = rev?.summary?.totalReviews ?? 0;

  return (
    <View className="mt-2 px-4 pb-3">
      <ProductAccordion title="Mô tả sản phẩm" defaultOpen>
        {desc?.title ? (
          <Text className="mb-2 text-[15px] font-semibold text-app-fg dark:text-neutral-100">
            {desc.title}
          </Text>
        ) : null}
        {desc?.paragraphs?.map((p, i) => (
          <Text
            key={`p-${i}`}
            className={cn(
              "text-sm leading-[22px] text-app-fg dark:text-neutral-100",
              i > 0 && "mt-2"
            )}
          >
            {p}
          </Text>
        ))}
        {desc?.bulletPoints?.length ? (
          <View className="mt-2.5">
            {desc.bulletPoints.map((b, i) => (
              <View key={`b-${i}`} className="mt-1.5 flex-row gap-2">
                <View
                  className="mt-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colors.tint }}
                />
                <Text className="flex-1 text-sm leading-[22px] text-app-fg dark:text-neutral-100">
                  {b}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ProductAccordion>

      <ProductAccordion title="Chất liệu">
        {mats?.title ? (
          <Text className="mb-2 text-[15px] font-semibold text-app-fg dark:text-neutral-100">
            {mats.title}
          </Text>
        ) : null}
        {mats?.items?.map((it, i) => (
          <View key={`m-${i}`} className="mt-1.5 flex-row gap-2">
            <View className="mt-0.5">
              <AppIcon name="check-circle" size={16} color={colors.tint} />
            </View>
            <Text className="flex-1 text-sm leading-[22px] text-app-fg dark:text-neutral-100">
              {it}
            </Text>
          </View>
        ))}
        {!mats?.items?.length ? (
          <Text className="text-sm text-app-muted dark:text-neutral-400">Chưa có dữ liệu.</Text>
        ) : null}
      </ProductAccordion>

      <ProductAccordion title="Thông tin bổ sung">
        {add.length === 0 ? (
          <Text className="text-sm text-app-muted dark:text-neutral-400">Chưa có dữ liệu.</Text>
        ) : (
          add.map((row, i) => (
            <View
              key={`a-${i}`}
              className={cn(
                "flex-row py-2",
                i < add.length - 1 && "border-b border-black/5 dark:border-white/10"
              )}
            >
              <Text className="w-[42%] text-[13px] font-medium text-app-muted dark:text-neutral-400">
                {row.label}
              </Text>
              <Text className="flex-1 text-[13px] font-semibold text-app-fg dark:text-neutral-100">
                {row.value}
              </Text>
            </View>
          ))
        )}
      </ProductAccordion>

      <ProductAccordion
        title="Đánh giá khách hàng"
        badge={totalReviews > 0 ? totalReviews : undefined}
        last
      >
        {productId != null ? (
          <ProductReviewsBlock
            productId={productId}
            token={token}
            user={user}
            tabsReviews={rev}
          />
        ) : (
          <Text className="text-sm text-app-muted dark:text-neutral-400">Không tải được đánh giá.</Text>
        )}
      </ProductAccordion>
    </View>
  );
}
