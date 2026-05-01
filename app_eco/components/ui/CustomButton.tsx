import React, { type ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, TextStyle, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type Variant = "primary" | "secondary";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Ghi đè màu chữ (ví dụ nút secondary viền tint) */
  titleColor?: string;
  titleStyle?: StyleProp<TextStyle>;
  /** Nhãn phụ phía trên title (card liên hệ, v.v.) */
  subtitle?: string;
  /** Icon / nội dung bên trái title */
  leftIcon?: ReactNode;
  /** Icon bên phải (menu dạng hàng) */
  rightIcon?: ReactNode;
};

export function CustomButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  titleColor,
  titleStyle,
  subtitle,
  leftIcon,
  rightIcon,
}: Props) {
  const colors = useAppColors();
  const isPrimary = variant === "primary";

  const bg = isPrimary ? colors.brandAccent : colors.surfaceMuted;
  const fg = titleColor ?? (isPrimary ? "#FFFFFF" : colors.text);

  const hasComplexLayout = Boolean(subtitle || leftIcon || rightIcon);

  const labelEl = (
    <Text
      style={[
        {
          color: fg,
          fontSize: 16,
          fontWeight: "600",
          textAlign: leftIcon || subtitle || rightIcon ? "left" : "center",
        },
        titleStyle,
      ]}
      numberOfLines={rightIcon ? 2 : undefined}
    >
      {title}
    </Text>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 999,
          alignItems: hasComplexLayout ? "stretch" : "center",
          justifyContent: "center",
          opacity: disabled || loading ? 0.55 : 1,
        },
        style,
      ]}
      className="active:opacity-90"
    >
      {loading ? (
        <LoadingSpinner visible inline message="" indicatorColor={fg} />
      ) : rightIcon ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
            }}
          >
            {leftIcon}
            <View style={{ flex: 1, minWidth: 0 }}>
              {subtitle ? (
                <Text
                  className="mb-1 text-left text-xs"
                  style={{ color: colors.mutedText }}
                >
                  {subtitle}
                </Text>
              ) : null}
              {labelEl}
            </View>
          </View>
          {rightIcon}
        </View>
      ) : subtitle || leftIcon ? (
        <View style={{ width: "100%" }}>
          {subtitle ? (
            <Text
              className="mb-1 text-left text-xs"
              style={{ color: colors.mutedText }}
            >
              {subtitle}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: leftIcon || subtitle ? "flex-start" : "center",
              gap: leftIcon ? 8 : 0,
            }}
          >
            {leftIcon}
            <Text
              style={[
                {
                  color: fg,
                  fontSize: 16,
                  fontWeight: "600",
                  flex: leftIcon ? 1 : undefined,
                  textAlign: leftIcon || subtitle ? "left" : "center",
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        </View>
      ) : (
        labelEl
      )}
    </Pressable>
  );
}
