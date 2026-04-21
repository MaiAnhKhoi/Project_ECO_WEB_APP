import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppColors } from "@/hooks/use-app-colors";
import { refreshOrderAttentionBadges } from "@/services/orderAttentionBadge";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useOrderAttentionStore } from "@/store/orderAttentionStore";
import { useWishlistStore } from "@/store/wishlistStore";

type TabKey = "index" | "orders" | "shop" | "wishlist" | "cart";

const TAB_META: Record<
  TabKey,
  { label: string; iconName: React.ComponentProps<typeof IconSymbol>["name"] }
> = {
  index: { label: "Trang chủ", iconName: "house.fill" },
  orders: { label: "Đơn hàng", iconName: "list.clipboard.fill" },
  shop: { label: "Cửa hàng", iconName: "bag.fill" },
  wishlist: { label: "Yêu thích", iconName: "heart" },
  cart: { label: "Giỏ hàng", iconName: "cart.fill" },
};

export default function Footer({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const isLoggedIn = !!token;
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const cartCount = useCartStore((s) => s.totalCount(isLoggedIn));
  const payosPendingCount = useOrderAttentionStore((s) => s.payosPendingCount);

  useEffect(() => {
    if (!isLoggedIn) {
      useOrderAttentionStore.getState().reset();
      return;
    }
    const t = setTimeout(() => {
      void refreshOrderAttentionBadges(token ?? null);
    }, 400);
    return () => clearTimeout(t);
  }, [isLoggedIn, token, state.index]);

  return (
    <View
      className="border-t border-black/10 bg-white"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View className="flex-row items-center justify-around px-2 pt-2">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const key = route.name as TabKey;
          const meta = TAB_META[key];
          if (!meta) return null;

          const { options } = descriptors[route.key];
          /** Tab Đơn hàng: badge đỏ = số đơn PayOS còn trong hạn thanh toán (theo canShowPayOSRetryPay) */
          const badge =
            key === "wishlist"
              ? wishlistCount
              : key === "cart"
                ? cartCount
                : key === "orders"
                  ? payosPendingCount
                  : options.tabBarBadge;
          const color = isFocused ? colors.tint : colors.mutedText;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-2"
            >
              <View className="relative">
                <IconSymbol size={22} name={meta.iconName} color={color} />
                {typeof badge === "number" && badge > 0 ? (
                  <View
                    className={`absolute -right-2 -top-1 min-h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 ${
                      key === "orders" ? "bg-red-600" : "bg-red-500"
                    }`}
                    style={{ paddingHorizontal: badge > 9 ? 4 : 0 }}
                  >
                    <Text className="text-[10px] font-semibold text-white">
                      {badge > 99 ? "99+" : badge}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                className="mt-1 text-[12px]"
                style={{ color, fontWeight: isFocused ? "600" : "400" }}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
