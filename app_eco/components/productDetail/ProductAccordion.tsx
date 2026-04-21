import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { cn } from "@/utils/cn";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  badge?: string | number;
  defaultOpen?: boolean;
  /** Bỏ viền dưới (accordion cuối danh sách). */
  last?: boolean;
  children: React.ReactNode;
};

export function ProductAccordion({
  title,
  badge,
  defaultOpen = false,
  last = false,
  children,
}: Props) {
  const colors = useAppColors();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: { type: "easeInEaseOut" },
      create: { type: "easeInEaseOut", property: "opacity" },
    });
    setOpen((v) => !v);
  };

  return (
    <View className={cn(!last && "border-b border-black/5 dark:border-white/10")}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-[15px] font-bold text-app-fg dark:text-neutral-100">
            {title}
          </Text>
          {badge !== undefined ? (
            <View
              className="h-5 min-w-[20px] items-center justify-center rounded-full px-1.5"
              style={{ backgroundColor: colors.tint }}
            >
              <Text className="text-[11px] font-bold text-white">{badge}</Text>
            </View>
          ) : null}
        </View>
        <View className="h-7 w-7 items-center justify-center rounded-full bg-app-surface dark:bg-neutral-800">
          <AppIcon name={open ? "minus" : "plus"} size={13} color={colors.mutedText} />
        </View>
      </Pressable>
      {open ? <View className="pb-4">{children}</View> : null}
    </View>
  );
}
