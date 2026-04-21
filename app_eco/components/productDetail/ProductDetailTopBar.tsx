import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { cn } from "@/utils/cn";

type Props = {
  title?: string;
  solid?: boolean;
  productUrl?: string;
};

export function ProductDetailTopBar({ title, solid = false, productUrl }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  const handleShare = async () => {
    try {
      await Share.share({
        message: title ? `Xem sản phẩm: ${title}` : "Xem sản phẩm tại UTE SHOP",
        url: productUrl,
      });
    } catch {
      // ignore
    }
  };

  const iconColor = solid ? colors.text : "#fff";

  const content = (
    <View
      className="flex-row items-center px-3 pb-2.5"
      style={{ paddingTop: insets.top + 4 }}
    >
      <CustomIconButton
        onPress={() => router.back()}
        accessibilityLabel="Quay lại"
        size={38}
        style={solid ? { backgroundColor: "transparent" } : { backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <AppIcon name="chevron-left" size={24} color={iconColor} />
      </CustomIconButton>

      <Text
        numberOfLines={1}
        className={cn(
          "mx-2 flex-1 text-[15px] font-semibold",
          solid ? "text-gray-900 dark:text-neutral-100" : "text-transparent"
        )}
      >
        {title || "Chi tiết sản phẩm"}
      </Text>

      <CustomIconButton
        onPress={handleShare}
        accessibilityLabel="Chia sẻ"
        size={38}
        style={solid ? { backgroundColor: "transparent" } : { backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <AppIcon name="share-2" size={22} color={iconColor} />
      </CustomIconButton>
    </View>
  );

  if (solid) {
    return (
      <View className="absolute left-0 right-0 top-0 z-[100] border-b border-black/10 bg-white/95 dark:border-white/10 dark:bg-neutral-950/95">
        {content}
      </View>
    );
  }

  return (
    <View className="absolute left-0 right-0 top-0 z-[100]">
      {Platform.OS !== "android" ? (
        <BlurView intensity={0} tint="dark" style={{ flex: 1 }}>
          {content}
        </BlurView>
      ) : (
        content
      )}
    </View>
  );
}
