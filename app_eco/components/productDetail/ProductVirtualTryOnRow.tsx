import React from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { cn } from "@/utils/cn";

type Props = {
  /** Phụ kiện / giày… — không hỗ trợ */
  disabled: boolean;
  onPress: () => void;
};

export function ProductVirtualTryOnRow({ disabled, onPress }: Props) {
  const colors = useAppColors();

  return (
    <View className="mx-4 mt-3">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={cn(
          "flex-row items-center gap-3 rounded-2xl border px-4 py-3.5",
          disabled
            ? "border-black/8 bg-neutral-100 dark:border-white/10 dark:bg-neutral-800/80"
            : "border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/10"
        )}
      >
        <View
          className={cn(
            "h-11 w-11 items-center justify-center rounded-full",
            disabled ? "bg-neutral-200 dark:bg-neutral-700" : "bg-white dark:bg-neutral-900"
          )}
        >
          <AppIcon
            name="image"
            size={22}
            color={disabled ? colors.mutedText : colors.tint}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className={cn(
              "text-[15px] font-bold",
              disabled ? "text-neutral-400 dark:text-neutral-500" : "text-app-fg dark:text-neutral-100"
            )}
          >
            Thử đồ ảo
          </Text>
          <Text className="mt-0.5 text-[12px] text-app-muted dark:text-neutral-400">
            {disabled
              ? "Chỉ áp dụng cho trang phục (áo, quần, váy)."
              : "Xem mặc thử bằng AI."}
          </Text>
        </View>
        {!disabled ? (
          <AppIcon name="chevron-right" size={20} color={colors.tint} />
        ) : null}
      </Pressable>
    </View>
  );
}
