import React, { type ReactNode } from "react";
import { Pressable, type StyleProp, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  /** Nút tròn nền xám nhạt; children là icon */
  children: ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function CustomIconButton({
  onPress,
  accessibilityLabel,
  children,
  size = 40,
  style,
}: Props) {
  const colors = useAppColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.iconButtonBg,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      className="active:opacity-70"
    >
      {children}
    </Pressable>
  );
}
