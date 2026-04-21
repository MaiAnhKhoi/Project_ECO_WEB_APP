import React from "react";
import { Text, View } from "react-native";

import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";

const R = 16;

type CartOrderSummaryProps = {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
};

export function CartOrderSummary({
  subtotal,
  itemCount,
  onCheckout,
  disabled,
}: CartOrderSummaryProps) {
  const colors = useAppColors();

  return (
    <View
      className="mt-3 bg-white p-5 shadow-sm dark:bg-neutral-900"
      style={{ borderRadius: R, borderWidth: 1, borderColor: `${colors.border}88` }}
    >
      <View
        className="flex-row items-baseline justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800"
      >
        <Text className="text-[13px] text-neutral-500 dark:text-neutral-400">Tạm tính</Text>
        <Text className="text-[17px] font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
          {subtotal.toLocaleString("vi-VN")}₫
        </Text>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[12px] text-neutral-400 dark:text-neutral-500">
          {itemCount} món đã chọn · Phí ship khi thanh toán
        </Text>
      </View>

      <View className="mt-5">
        <CustomButton
          title="Thanh toán"
          onPress={onCheckout}
          disabled={disabled}
          titleStyle={{ fontSize: 15, fontWeight: "700", letterSpacing: 0.3 }}
          style={{
            borderRadius: R,
            paddingVertical: 15,
            backgroundColor: disabled ? "#A3A3A3" : colors.tint,
          }}
          accessibilityLabel="Thanh toán"
        />
      </View>
    </View>
  );
}
