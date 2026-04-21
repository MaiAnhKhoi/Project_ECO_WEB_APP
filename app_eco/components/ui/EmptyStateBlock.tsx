import React from "react";
import { Text, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Action = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

type Props = {
  iconName: AppIconName;
  sectionLabel?: string;
  title: string;
  description: string;
  action?: Action;
};

/**
 * Khối trống đồng bộ: icon lớn trong vòng tròn, typography giống giỏ / yêu thích.
 */
export function EmptyStateBlock({
  iconName,
  sectionLabel,
  title,
  description,
  action,
}: Props) {
  const colors = useAppColors();

  return (
    <View className="flex-1 justify-center px-8 pb-16">
      <View className="items-center">
        <View
          className="mb-6 h-[104px] w-[104px] items-center justify-center rounded-full"
          style={{ backgroundColor: colors.surfaceMuted }}
        >
          <AppIcon name={iconName} size={48} color={colors.mutedText} />
        </View>
        {sectionLabel ? (
          <Text
            className="text-center text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: colors.mutedText }}
          >
            {sectionLabel}
          </Text>
        ) : null}
        <Text
          className={`text-center text-xl font-semibold tracking-tight ${sectionLabel ? "mt-3" : ""}`}
          style={{ color: colors.text }}
        >
          {title}
        </Text>
        <Text
          className="mt-2 max-w-[280px] text-center text-[14px] leading-[22px]"
          style={{ color: colors.mutedText }}
        >
          {description}
        </Text>
        {action ? (
          <View className="mt-8 w-full max-w-[280px]">
            <CustomButton
              title={action.label}
              variant={action.variant ?? "primary"}
              onPress={action.onPress}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
