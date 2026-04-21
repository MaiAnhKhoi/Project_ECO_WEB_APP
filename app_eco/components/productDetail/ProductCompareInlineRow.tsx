import React from "react";
import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  compareCount: number;
  isCurrentCompared: boolean;
  onToggle: () => void;
  onViewCompare: () => void;
};

export function ProductCompareInlineRow({
  compareCount,
  isCurrentCompared,
  onToggle,
  onViewCompare,
}: Props) {
  const colors = useAppColors();

  return (
    <View className="mx-4 mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-primary/5 dark:border-primary/35 dark:bg-primary/10">
      <View className="flex-row items-center gap-3 px-3 py-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-900">
          <AppIcon name="grid" size={22} color={colors.tint} />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-app-fg dark:text-neutral-100">
            So sánh sản phẩm
          </Text>
          <Text className="mt-0.5 text-xs text-app-muted dark:text-neutral-400">
            Đang có {compareCount} sản phẩm trong danh sách so sánh
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2 border-t border-black/5 px-3 pb-3 pt-2 dark:border-white/10">
        <View className="min-w-0 flex-1">
          <CustomButton
            title={isCurrentCompared ? "Bỏ khỏi so sánh" : "Thêm sản phẩm này"}
            variant="secondary"
            onPress={onToggle}
            leftIcon={
              <AppIcon
                name={isCurrentCompared ? "minus-circle" : "plus-circle"}
                size={18}
                color={isCurrentCompared ? "#DC2626" : colors.tint}
              />
            }
            titleColor={isCurrentCompared ? "#DC2626" : colors.tint}
            titleStyle={{ fontSize: 14, fontWeight: "600", flexShrink: 1 }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: isCurrentCompared ? "rgba(239,68,68,0.12)" : colors.background,
              borderWidth: 1,
              borderColor: isCurrentCompared ? "rgba(220,38,38,0.35)" : `${colors.tint}55`,
            }}
          />
        </View>
        <CustomButton
          title="Mở so sánh"
          onPress={onViewCompare}
          titleStyle={{ fontSize: 12, fontWeight: "700" }}
          style={{
            minWidth: 88,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: colors.tint,
          }}
        />
      </View>
    </View>
  );
}
