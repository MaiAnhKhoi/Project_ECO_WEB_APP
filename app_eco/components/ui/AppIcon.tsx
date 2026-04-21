import Feather from "@expo/vector-icons/Feather";
import React, { type ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

/** Icon Feather (viền), đồng bộ màu theme — mọi tên glyph Feather đều hợp lệ */
export type AppIconName = ComponentProps<typeof Feather>["name"];

type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function AppIcon({ name, size = 22, color, style }: Props) {
  const colors = useAppColors();
  return (
    <Feather
      name={name}
      size={size}
      color={color ?? colors.icon}
      style={style}
    />
  );
}
