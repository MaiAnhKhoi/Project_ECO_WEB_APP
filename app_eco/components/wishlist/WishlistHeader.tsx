import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  onOpenFilter: () => void;
  filterActive?: boolean;
};

export function WishlistHeader({
  title = "Yêu thích",
  subtitle,
  onBack,
  onOpenFilter,
  filterActive = false,
}: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 6,
        paddingBottom: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View className="flex-row items-center">
        <CustomIconButton onPress={onBack} accessibilityLabel="Trở lại">
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>

        <View className="min-w-0 flex-1 px-2">
          <Text
            className="text-[20px] font-semibold tracking-tight"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-0.5 text-[13px]"
              style={{ color: colors.mutedText }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="relative">
          <CustomIconButton
            onPress={onOpenFilter}
            accessibilityLabel="Bộ lọc và sắp xếp"
            style={
              filterActive
                ? {
                    backgroundColor: `${colors.tint}18`,
                  }
                : undefined
            }
          >
            <AppIcon
              name="sliders"
              size={20}
              color={filterActive ? colors.tint : colors.text}
            />
          </CustomIconButton>
          {filterActive ? (
            <View
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2"
              style={{
                borderColor: colors.background,
                backgroundColor: colors.tint,
              }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
