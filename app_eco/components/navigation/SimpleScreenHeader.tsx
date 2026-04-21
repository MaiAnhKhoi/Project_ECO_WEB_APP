import React, { type ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** Nút / nhóm bên phải (vd. thêm địa chỉ) */
  right?: ReactNode;
};

/**
 * Header stack giống Wishlist/Shop: safe area, viền dưới, back + tiêu đề trái.
 */
export function SimpleScreenHeader({ title, subtitle, onBack, right }: Props) {
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

        {right ?? <View style={{ width: 40 }} />}
      </View>
    </View>
  );
}
