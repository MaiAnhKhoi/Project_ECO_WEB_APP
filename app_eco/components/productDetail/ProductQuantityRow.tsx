import React from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  quantity: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
};

export function ProductQuantityRow({ quantity, max, onChange, disabled }: Props) {
  const colors = useAppColors();
  const canDec = !disabled && quantity > 1;
  const canInc = !disabled && max > 0 && quantity < max;

  return (
    <View className="mt-4 flex-row items-center justify-between px-4">
      <View>
        <Text className="text-sm font-semibold text-app-fg dark:text-neutral-100">
          Số lượng
        </Text>
        {max > 0 ? (
          <Text className="mt-0.5 text-xs text-app-muted dark:text-neutral-400">
            Còn {max} sản phẩm
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
        <Pressable
          onPress={() => canDec && onChange(quantity - 1)}
          disabled={!canDec}
          accessibilityRole="button"
          accessibilityLabel="Giảm số lượng"
          className="h-[42px] w-[42px] items-center justify-center"
          style={{ backgroundColor: canDec ? colors.surfaceMuted : "#FAFAFA" }}
        >
          <AppIcon
            name="minus"
            size={15}
            color={canDec ? colors.text : colors.mutedText}
          />
        </Pressable>

        <View className="h-[42px] w-11 items-center justify-center border-x border-black/10 dark:border-white/10">
          <Text className="text-base font-bold" style={{ color: colors.text }}>
            {quantity}
          </Text>
        </View>

        <Pressable
          onPress={() => canInc && onChange(quantity + 1)}
          disabled={!canInc}
          accessibilityRole="button"
          accessibilityLabel="Tăng số lượng"
          className="h-[42px] w-[42px] items-center justify-center"
          style={{ backgroundColor: canInc ? colors.tint : "#FAFAFA" }}
        >
          <AppIcon
            name="plus"
            size={15}
            color={canInc ? "#fff" : colors.mutedText}
          />
        </Pressable>
      </View>
    </View>
  );
}
