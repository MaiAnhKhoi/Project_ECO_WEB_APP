import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
};

/**
 * Header riêng cho tab (khi tắt Header toàn app): an toàn vùng notch + tiêu đề editorial.
 */
export function TabScreenHeader({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      style={{ paddingTop: insets.top + 10, paddingBottom: 14, paddingHorizontal: 20 }}
    >
      <Text className="text-[26px] font-light tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">{subtitle}</Text>
      ) : null}
    </View>
  );
}
