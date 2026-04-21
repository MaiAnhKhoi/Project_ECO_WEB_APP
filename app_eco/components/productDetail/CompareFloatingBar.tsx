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
  bottomOffset: number;
};

export function CompareFloatingBar({
  compareCount,
  isCurrentCompared,
  onToggle,
  onViewCompare,
  bottomOffset,
}: Props) {
  const colors = useAppColors();

  const toggleTitle = isCurrentCompared
    ? "Bỏ chọn"
    : compareCount === 0
      ? "Thêm SP"
      : "+ Thêm";

  return (
    <View
      className="absolute left-4 right-4 z-[95] flex-row items-center gap-2 rounded-2xl bg-app-slate px-3 py-2.5 shadow-lg dark:bg-neutral-800"
      style={{
        bottom: bottomOffset,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View className="flex-row items-center gap-1.5">
        <AppIcon name="grid" size={20} color="#fff" />
        <Text className="text-[13px] font-semibold text-white">
          So sánh ({compareCount})
        </Text>
      </View>

      <View className="flex-1" />

      <View className="min-w-0 shrink">
        <CustomButton
          title={toggleTitle}
          variant="secondary"
          onPress={onToggle}
          titleColor={isCurrentCompared ? "#FECACA" : "#e5e5e5"}
          titleStyle={{ fontSize: 12, fontWeight: "600" }}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: isCurrentCompared ? "rgba(239,68,68,0.15)" : "transparent",
            borderWidth: 1.5,
            borderColor: isCurrentCompared ? "rgba(248,113,113,0.8)" : "rgba(255,255,255,0.4)",
          }}
        />
      </View>

      <CustomButton
        title="Xem"
        onPress={onViewCompare}
        titleStyle={{ fontSize: 12, fontWeight: "700" }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          backgroundColor: colors.tint,
        }}
      />
    </View>
  );
}
