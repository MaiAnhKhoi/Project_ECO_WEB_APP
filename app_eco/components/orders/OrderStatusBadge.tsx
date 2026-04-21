import React from "react";
import { Text, View } from "react-native";

import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_LABEL,
  normalizeOrderStatusKey,
} from "@/types/order";

type Props = {
  status: string;
  kind?: "order" | "payment";
  size?: "sm" | "md";
};

export function OrderStatusBadge({
  status,
  kind = "order",
  size = "md",
}: Props) {
  const colorMap = kind === "order" ? ORDER_STATUS_COLOR : PAYMENT_STATUS_COLOR;
  const labelMap =
    kind === "order" ? ORDER_STATUS_LABEL : PAYMENT_STATUS_LABEL;

  const norm = normalizeOrderStatusKey(status);
  const colors = colorMap[norm] ?? { bg: "#F3F4F6", text: "#6B7280" };
  const label = labelMap[norm] ?? "Không xác định";

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderRadius: 999,
        paddingHorizontal: size === "sm" ? 8 : 10,
        paddingVertical: size === "sm" ? 2 : 4,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: size === "sm" ? 11 : 12,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
