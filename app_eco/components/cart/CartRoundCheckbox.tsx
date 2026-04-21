import React from "react";
import { Pressable, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

const SIZE = 22;

type Props = {
  checked: boolean;
  /** Một phần được chọn (vòng màu, gạch ngang) */
  indeterminate?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Chỉ vẽ ô (cha gắn sự kiện nhấn — tránh Pressable lồng nhau) */
  nonInteractive?: boolean;
};

export function CartRoundCheckbox({
  checked,
  indeterminate = false,
  onPress,
  disabled,
  accessibilityLabel = "",
  nonInteractive = false,
}: Props) {
  const colors = useAppColors();
  const active = checked || indeterminate;

  const circle = (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        borderWidth: 2,
        borderColor: active ? colors.tint : "rgba(160,160,160,0.85)",
        backgroundColor: checked ? colors.tint : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? (
        <AppIcon name="check" size={13} color="#FFFFFF" />
      ) : indeterminate ? (
        <View
          style={{
            width: 10,
            height: 2,
            borderRadius: 1,
            backgroundColor: colors.tint,
          }}
        />
      ) : null}
    </View>
  );

  if (nonInteractive) {
    return circle;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: checked || indeterminate }}
      accessibilityLabel={accessibilityLabel}
    >
      {circle}
    </Pressable>
  );
}
