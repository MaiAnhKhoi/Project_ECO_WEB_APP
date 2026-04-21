import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  title?: string;
  onPressLeft?: () => void;
  onPressSearch?: () => void;
  onPressMessage?: () => void;
  onPressNotifications?: () => void;
  messageBadgeCount?: number;
  leftIcon?: "menu" | "arrow-left";
};

export default function Header({
  title = "UTE_SHOP",
  onPressLeft,
  onPressSearch,
  onPressMessage,
  onPressNotifications,
  messageBadgeCount = 0,
  leftIcon = "menu",
}: Props) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <View
      className="border-b border-black/10 bg-white/95 dark:border-white/10 dark:bg-neutral-950/95"
      style={{ paddingTop: insets.top }}
    >
      <View className="h-14 flex-row items-center justify-between px-4">
        <CustomIconButton
          onPress={() => onPressLeft?.()}
          accessibilityLabel={leftIcon === "menu" ? "Mở menu" : "Trở lại"}
        >
          <AppIcon
            name={leftIcon === "menu" ? "menu" : "chevron-left"}
            size={22}
            color={colors.text}
          />
        </CustomIconButton>

        <View className="flex-1 px-2">
          <Text
            numberOfLines={1}
            className="text-left text-xl font-bold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <CustomIconButton onPress={() => onPressSearch?.()} accessibilityLabel="Tìm kiếm">
            <AppIcon name="search" size={24} color={colors.text} />
          </CustomIconButton>
          {onPressMessage ? (
            <CustomIconButton onPress={() => onPressMessage()} accessibilityLabel="Tin nhắn">
              <View className="relative">
                <AppIcon name="message-circle" size={20} color={colors.text} />
                {messageBadgeCount > 0 ? (
                  <View className="absolute -right-2.5 -top-1.5 min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-600 px-1.5 py-0.5 dark:border-neutral-900">
                    <Text className="text-[11px] font-bold text-white">
                      {messageBadgeCount > 9 ? "9+" : String(messageBadgeCount)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </CustomIconButton>
          ) : null}
          <CustomIconButton
            onPress={() => onPressNotifications?.()}
            accessibilityLabel="Thông báo"
          >
            <AppIcon name="bell" size={24} color={colors.text} />
          </CustomIconButton>
        </View>
      </View>
    </View>
  );
}
