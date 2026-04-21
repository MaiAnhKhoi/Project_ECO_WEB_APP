import { BlurView } from "expo-blur";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  wishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  addDisabled?: boolean;
  outOfStock?: boolean;
};

export function ProductDetailBottomBar({
  wishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  addDisabled,
  outOfStock,
}: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const inner = (
    <View
      className="flex-row items-center gap-2.5 px-4 pt-2.5"
      style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }}
    >
      <CustomIconButton
        onPress={onToggleWishlist}
        accessibilityLabel={wishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        size={48}
        style={{
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: wishlisted ? "#EF4444" : colors.border,
          backgroundColor: wishlisted
            ? colors.scheme === "dark"
              ? "rgba(127,29,29,0.35)"
              : "#FEF2F2"
            : colors.background,
        }}
      >
        <AppIcon
          name="heart"
          size={22}
          color={wishlisted ? "#DC2626" : "#6B7280"}
        />
      </CustomIconButton>

      <View className="min-h-12 flex-1 justify-center">
        <CustomButton
          title={outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          variant="secondary"
          onPress={onAddToCart}
          disabled={addDisabled}
          titleColor={addDisabled ? colors.mutedText : colors.tint}
          titleStyle={{ fontSize: 14, fontWeight: "600" }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: addDisabled ? "rgba(0,0,0,0.10)" : colors.tint,
            backgroundColor: colors.background,
          }}
          accessibilityLabel="Thêm vào giỏ hàng"
        />
      </View>

      <View className="min-h-12 flex-1 justify-center">
        <CustomButton
          title="Mua ngay"
          onPress={onBuyNow}
          disabled={addDisabled}
          titleColor={addDisabled ? colors.mutedText : "#fff"}
          titleStyle={{ fontSize: 14, fontWeight: "700" }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 14,
            backgroundColor: addDisabled ? colors.surfaceMuted : colors.tint,
            opacity: addDisabled ? 0.6 : 1,
          }}
          accessibilityLabel="Mua ngay"
        />
      </View>
    </View>
  );

  return (
    <View className="absolute bottom-0 left-0 right-0 z-[100] border-t border-black/10 dark:border-white/10">
      {Platform.OS === "ios" ? (
        <BlurView intensity={85} tint="light" style={{ flex: 1 }}>
          {inner}
        </BlurView>
      ) : (
        <View className="bg-white dark:bg-neutral-950">{inner}</View>
      )}
    </View>
  );
}
