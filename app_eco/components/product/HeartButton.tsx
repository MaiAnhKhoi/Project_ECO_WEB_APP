import React from "react";
import { Pressable, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
};

export function HeartButton({ active, onPress, size = 18 }: Props) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      className="active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={active ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
        }}
      >
        <AppIcon
          name="heart"
          size={size}
          color={active ? "#E11D48" : colors.text}
        />
      </View>
    </Pressable>
  );
}
