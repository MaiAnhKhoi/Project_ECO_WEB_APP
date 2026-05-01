import { usePathname, useRouter, useSegments } from "expo-router";
import React, { memo, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";

/** Chiều cao ước lượng tab bar (Footer) — FAB đặt phía trên khi tab bar đang hiện */
const TAB_BAR_ESTIMATE = 64;

/**
 * Khớp `BOTTOM_BAR_H` / `COMPARE_BAR_H` trong `app/product/[id].tsx`
 * để FAB không chồng «Mua ngay» và thanh so sánh.
 */
const PRODUCT_DETAIL_BOTTOM_BAR_BODY = 62;
const PRODUCT_DETAIL_COMPARE_BAR = 52;
const FAB_GAP_ABOVE_PRODUCT_STACK = 14;

function useAIChatFabVisible(): boolean {
  const pathname = usePathname();
  const segments = useSegments();

  return useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/ai-chat") || pathname.startsWith("/ai-stylist")) return false;
    if (pathname.startsWith("/product")) return true;

    const isTabs = segments[0] === "(tabs)";
    const tab = segments[1];
    const isCartTab = tab === "cart" || pathname.includes("/(tabs)/cart");
    const isHomeTab =
      pathname === "/" ||
      pathname === "" ||
      pathname === "/(tabs)" ||
      (isTabs &&
        tab !== "cart" &&
        tab !== "shop" &&
        tab !== "orders" &&
        tab !== "wishlist");
    return isHomeTab || isCartTab;
  }, [pathname, segments]);
}

/** FAB: offset bottom khác nhau khi có / không có tab bar */
function useFabBottomOffset(): number {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const safe = Math.max(insets.bottom, 8);
    const onProductStack = pathname?.startsWith("/product") ?? false;
    if (onProductStack) {
      const bottomPad = insets.bottom > 0 ? insets.bottom : 10;
      return (
        PRODUCT_DETAIL_BOTTOM_BAR_BODY +
        bottomPad +
        PRODUCT_DETAIL_COMPARE_BAR +
        FAB_GAP_ABOVE_PRODUCT_STACK
      );
    }
    return safe + TAB_BAR_ESTIMATE;
  }, [pathname, insets.bottom]);
}

/**
 * FAB mở AIChatScreen — Trang chủ, Giỏ hàng, Chi tiết SP; ẩn khi đang ở AI chat/stylist.
 */
function AIChatFabInner() {
  const colors = useAppColors();
  const router = useRouter();
  const pathname = usePathname();
  const visible = useAIChatFabVisible();
  const bottom = useFabBottomOffset();

  const onProduct = pathname?.startsWith("/product") ?? false;
  /** Chi tiết SP (light): icon màu chữ đen; các trường hợp khác giữ trắng trên nền teal. */
  const iconColor =
    onProduct && colors.scheme === "light" ? colors.text : "#fff";

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chat với AI"
        onPress={() => navLockRun(() => router.push("/ai-chat" as any))}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.brandAccent,
            opacity: pressed ? 0.92 : 1,
            shadowColor: "#000",
          },
        ]}
      >
        <AppIcon name="message-circle" size={26} color={iconColor} />
      </Pressable>
    </View>
  );
}

export const AIChatFab = memo(AIChatFabInner);

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 16,
    zIndex: 100,
    alignItems: "flex-end",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
