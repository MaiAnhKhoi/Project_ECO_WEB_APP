import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import type { SizeOption } from "@/hooks/useProductVariantSelection";
import { cn } from "@/utils/cn";

type Props = {
  sizes: SizeOption[];
  activeValue: string;
  onSelect: (value: string) => void;
};

export function ProductSizePicker({ sizes, activeValue, onSelect }: Props) {
  const appColors = useAppColors();
  if (sizes.length === 0) return null;

  const activeSize = sizes.find((s) => s.value === activeValue);

  return (
    <View className="mt-4 px-4">
      <View className="mb-2.5 flex-row flex-wrap items-baseline">
        <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">Kích cỡ:</Text>
        {activeSize ? (
          <Text className="ml-1.5 text-sm font-medium" style={{ color: appColors.tint }}>
            {activeSize.display}
          </Text>
        ) : null}
        {activeSize && activeSize.stockQuantity > 0 ? (
          <Text className="ml-1 text-xs text-app-muted dark:text-neutral-400">
            (còn {activeSize.stockQuantity})
          </Text>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {sizes.map((s) => {
            const active = activeValue === s.value;
            const disabled = !s.inStock;

            return (
              <Pressable
                key={s.value}
                onPress={() => !disabled && onSelect(s.value)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ selected: active, disabled }}
                accessibilityLabel={`Kích cỡ ${s.display}${disabled ? ", hết hàng" : ""}`}
              >
                <View
                  className={cn(
                    "relative min-w-[52px] items-center justify-center overflow-hidden rounded-[10px] px-2.5 py-2.5",
                    disabled ? "opacity-50" : "opacity-100"
                  )}
                  style={{
                    height: 44,
                    borderWidth: active ? 2 : 1,
                    borderColor: active
                      ? appColors.tint
                      : disabled
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(0,0,0,0.14)",
                    backgroundColor: active ? appColors.tint : disabled ? appColors.surfaceMuted : "#fff",
                  }}
                >
                  <Text
                    className={cn("text-[13px]", active ? "font-bold" : "font-medium")}
                    style={{
                      color: active ? "#fff" : disabled ? appColors.mutedText : appColors.text,
                      textDecorationLine: disabled ? "line-through" : "none",
                    }}
                  >
                    {s.display}
                  </Text>

                  {disabled ? (
                    <View
                      className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center"
                      pointerEvents="none"
                    >
                      <View
                        className="h-px w-[140%] bg-black/20"
                        style={{ transform: [{ rotate: "-30deg" }] }}
                      />
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
