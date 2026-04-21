import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { CartRoundCheckbox } from "@/components/cart/CartRoundCheckbox";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { CartVariantOption } from "@/types/cart";
import { resolveAssetUrl } from "@/utils/assetUrl";

const CHIP_RADIUS = 14;

type CartItemCardProps = {
  id: number;
  productId: number;
  productName: string;
  imgSrc?: string | null;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  maxQuantity?: number;
  variantOptions?: CartVariantOption[];
  selectedVariantId?: number | null;
  onSelectVariant?: (opt: CartVariantOption) => void;
  /** Ô tròn chọn thanh toán (kiểu Shopee) */
  checkoutSelected?: boolean;
  onToggleCheckout?: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onPress?: () => void;
  disabled?: boolean;
};

function formatOptLabel(opt: CartVariantOption): string {
  const c = opt.color?.trim() || "";
  const s = opt.size?.trim() || "";
  if (c && s) return `${c} · ${s}`;
  if (c) return c;
  if (s) return s;
  return "Mặc định";
}

export function CartItemCard({
  productName,
  imgSrc,
  price,
  quantity,
  color,
  size,
  maxQuantity,
  variantOptions,
  selectedVariantId,
  onSelectVariant,
  checkoutSelected = true,
  onToggleCheckout,
  onIncrease,
  onDecrease,
  onRemove,
  onPress,
  disabled,
}: CartItemCardProps) {
  const colors = useAppColors();
  const imgUri = resolveAssetUrl(imgSrc ?? null) ?? imgSrc ?? "";

  const canIncrease = maxQuantity == null || quantity < maxQuantity;
  const lineTotal = price * quantity;
  const showVariantPicker =
    Boolean(onSelectVariant) &&
    Array.isArray(variantOptions) &&
    variantOptions.length > 1;

  const showCheckoutToggle = Boolean(onToggleCheckout);

  return (
    <View
      className="flex-row gap-2 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
      style={{ borderWidth: 1, borderColor: `${colors.border}99` }}
    >
      {showCheckoutToggle ? (
        <View className="justify-center pt-1">
          <CartRoundCheckbox
            checked={checkoutSelected}
            onPress={onToggleCheckout!}
            disabled={disabled}
            accessibilityLabel={
              checkoutSelected ? "Bỏ chọn sản phẩm" : "Chọn sản phẩm để thanh toán"
            }
          />
        </View>
      ) : null}

      <Pressable onPress={onPress} disabled={!onPress} className="overflow-hidden rounded-xl">
        <Image
          source={{ uri: imgUri }}
          style={{ width: 96, height: 120 }}
          contentFit="cover"
          transition={200}
        />
      </Pressable>

      <View className="min-w-0 flex-1 justify-between py-0.5">
        <View>
          <Pressable onPress={onPress} disabled={!onPress}>
            <Text
              numberOfLines={2}
              className="text-[14px] font-semibold leading-5 text-neutral-900 dark:text-neutral-100"
            >
              {productName}
            </Text>
          </Pressable>
          {!showVariantPicker && (color || size) ? (
            <Text className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              {[color, size].filter(Boolean).join(" · ")}
            </Text>
          ) : null}

          {showVariantPicker ? (
            <View className="mt-2">
              <Text className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                Phiên bản
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row flex-wrap gap-2">
                  {variantOptions!.map((opt) => {
                    const active = selectedVariantId != null && opt.variantId === selectedVariantId;
                    const out = opt.maxQuantity != null && opt.maxQuantity <= 0;
                    return (
                      <Pressable
                        key={opt.variantId}
                        onPress={() => {
                          if (!out) onSelectVariant!(opt);
                        }}
                        disabled={disabled || out}
                        className="active:opacity-85"
                        style={{
                          borderRadius: CHIP_RADIUS,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderWidth: active ? 2 : 1,
                          borderColor: active ? colors.tint : colors.border,
                          backgroundColor: active ? `${colors.tint}14` : colors.surfaceMuted,
                          opacity: out ? 0.4 : 1,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          className="max-w-[140px] text-[12px] font-semibold"
                          style={{ color: active ? colors.tint : colors.text }}
                        >
                          {formatOptLabel(opt)}
                        </Text>
                        <Text
                          className="mt-0.5 text-[11px] tabular-nums"
                          style={{ color: colors.mutedText }}
                        >
                          {Number(opt.price).toLocaleString("vi-VN")}₫
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>

        <View className="mt-2">
          <Text className="text-[11px] tabular-nums text-neutral-400 dark:text-neutral-500">
            Đơn giá {price.toLocaleString("vi-VN")}₫
          </Text>
          <View className="mt-1">
            <Text className="text-[16px] font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
              {lineTotal.toLocaleString("vi-VN")}₫
            </Text>
            <View className="mt-2 flex-row justify-end">
              <View className="flex-row items-center gap-1.5">
                <Pressable
                  onPress={onDecrease}
                  disabled={disabled}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
                  style={{ backgroundColor: colors.surfaceMuted }}
                >
                  <AppIcon
                    name={quantity <= 1 ? "trash-2" : "minus"}
                    size={14}
                    color={quantity <= 1 ? "#EF4444" : colors.text}
                  />
                </Pressable>
                <Text className="min-w-[28px] text-center text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                  {quantity}
                </Text>
                <Pressable
                  onPress={onIncrease}
                  disabled={disabled || !canIncrease}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
                  style={{
                    backgroundColor: colors.surfaceMuted,
                    opacity: canIncrease && !disabled ? 1 : 0.35,
                  }}
                >
                  <AppIcon name="plus" size={14} color={colors.text} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onRemove}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center self-start rounded-full"
        style={{ backgroundColor: colors.surfaceMuted }}
        accessibilityLabel="Xoá"
      >
        <AppIcon name="x" size={18} color={colors.mutedText} />
      </Pressable>
    </View>
  );
}
