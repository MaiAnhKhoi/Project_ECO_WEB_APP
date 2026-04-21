import React from "react";
import { Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

function getInitial(displayName: string): string {
  const t = displayName.trim();
  if (!t) return "?";
  const first = Array.from(t)[0];
  return typeof first === "string" ? first.toUpperCase() : "?";
}

type Props = {
  /** Tên hiển thị — lấy chữ cái đầu */
  name: string;
  size?: number;
};

export function Avatar({ name, size = 88 }: Props) {
  const colors = useAppColors();
  const initial = getInitial(name);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.avatarBg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.36,
          fontWeight: "600",
          color: colors.text,
        }}
      >
        {initial}
      </Text>
    </View>
  );
}
