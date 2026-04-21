import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
  type StyleProp,
  ViewStyle,
} from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  /** Hiển thị overlay full màn hoặc block */
  visible: boolean;
  message?: string;
  fullscreen?: boolean;
  /** Vòng quay nhỏ, ít padding — ô tìm kiếm, footer list, v.v. */
  inline?: boolean;
  /** Ghi đè màu vòng quay (ví dụ nút primary chữ trắng) */
  indicatorColor?: string;
  indicatorSize?: "small" | "large";
  style?: StyleProp<ViewStyle>;
};

export function LoadingSpinner({
  visible,
  message: messageProp,
  fullscreen = true,
  inline = false,
  indicatorColor,
  indicatorSize,
  style,
}: Props) {
  const colors = useAppColors();
  const tint = indicatorColor ?? colors.tint;
  const message =
    messageProp !== undefined
      ? messageProp
      : inline
        ? ""
        : "Đang tải…";

  if (!visible) return null;

  const spinSize = indicatorSize ?? (inline ? "small" : "large");

  if (inline) {
    return (
      <View
        style={[{ alignItems: "center", justifyContent: "center" }, style]}
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator size={spinSize} color={tint} />
        {message ? (
          <Text
            className="mt-2 text-center text-xs"
            style={{ color: colors.mutedText }}
          >
            {message}
          </Text>
        ) : null}
      </View>
    );
  }

  const containerStyle: StyleProp<ViewStyle> = fullscreen
    ? {
        ...({
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
        } as const),
        backgroundColor:
          colors.scheme === "light"
            ? "rgba(255,255,255,0.88)"
            : "rgba(21,23,24,0.88)",
        alignItems: "center",
        justifyContent: "center",
      }
    : {
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
      };

  return (
    <View style={[containerStyle, style]} accessibilityLiveRegion="polite">
      <ActivityIndicator size={spinSize} color={tint} />
      {message ? (
        <Text
          className="mt-3 text-center text-sm"
          style={{ color: colors.mutedText }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
