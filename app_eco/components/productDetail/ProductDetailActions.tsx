import React from "react";
import { View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  wishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  addToCartLabel?: string;
  addDisabled?: boolean;
};

export function ProductDetailActions({
  wishlisted,
  onToggleWishlist,
  onAddToCart,
  addToCartLabel = "Thêm vào giỏ",
  addDisabled,
}: Props) {
  const colors = useAppColors();

  return (
    <View className="mt-4 flex-row items-stretch gap-3 px-4">
      <CustomIconButton
        onPress={onToggleWishlist}
        accessibilityLabel={wishlisted ? "Bỏ yêu thích" : "Thêm yêu thích"}
        size={48}
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <AppIcon
          name="heart"
          size={22}
          color={wishlisted ? "#DC2626" : colors.text}
        />
      </CustomIconButton>

      <View className="min-h-12 flex-1 justify-center">
        <CustomButton
          title={addToCartLabel}
          onPress={onAddToCart}
          disabled={addDisabled}
          titleColor={addDisabled ? colors.mutedText : "#FFFFFF"}
          titleStyle={{ fontSize: 15, fontWeight: "700" }}
          style={{
            paddingVertical: 14,
            borderRadius: 16,
            backgroundColor: addDisabled ? colors.surfaceMuted : colors.tint,
            opacity: addDisabled ? 0.6 : 1,
          }}
          accessibilityLabel={addToCartLabel}
        />
      </View>
    </View>
  );
}
