import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

type TabButtonProps = {
  tabKey: TabKey;
  isFocused: boolean;
  badge: number | string | undefined;
  color: string;
  label: string;
  iconName: React.ComponentProps<typeof IconSymbol>["name"];
  onPress: () => void;
  onLongPress: () => void;
};

const TabButton = memo(function TabButton({
  tabKey,
  isFocused,
  badge,
  color,
  label,
  iconName,
  onPress,
  onLongPress,
}: TabButtonProps) {
  const numericBadge = typeof badge === "number" ? badge : typeof badge === "string" ? Number(badge) : 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
    >
      <View style={styles.iconWrap}>
        <IconSymbol size={22} name={iconName} color={color} />
        {numericBadge > 0 ? (
          <View
            style={[
              styles.badge,
              { paddingHorizontal: numericBadge > 9 ? 4 : 0 },
              tabKey === "orders" ? styles.badgeOrders : styles.badgeDefault,
            ]}
          >
            <Text style={styles.badgeText}>
              {numericBadge > 99 ? "99+" : numericBadge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.label, { color, fontWeight: isFocused ? "600" : "400" }]}>
        {label}
      </Text>
    </Pressable>
  );
});

export default function Footer({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const isLoggedIn = !!token;
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const cartCount = useCartStore((s) => s.totalCount(isLoggedIn));
  const payosPendingCount = useOrderAttentionStore((s) => s.payosPendingCount);

  /**
   * Refresh order badges một lần khi login thay đổi, không phụ thuộc vào
   * state.index để tránh gọi API mỗi khi user nhấn tab.
   */
  const prevLoggedInRef = useRef(isLoggedIn);
  useEffect(() => {
    const changed = prevLoggedInRef.current !== isLoggedIn;
    prevLoggedInRef.current = isLoggedIn;
    if (!isLoggedIn) {
      useOrderAttentionStore.getState().reset();
      return;
    }
    if (changed) {
      void refreshOrderAttentionBadges(token ?? null);
    }
  }, [isLoggedIn, token]);

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const key = route.name as TabKey;
          const meta = TAB_META[key];
          if (!meta) return null;

          const { options } = descriptors[route.key];
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
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <TabButton
              key={route.key}
              tabKey={key}
              isFocused={isFocused}
              badge={badge as number | string | undefined}
              color={color}
              label={meta.label}
              iconName={meta.iconName}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.1)", backgroundColor: "#fff" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  iconWrap: { position: "relative" },
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    minWidth: 16,
    minHeight: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  badgeDefault: { backgroundColor: "#EF4444" },
  badgeOrders: { backgroundColor: "#DC2626" },
  badgeText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  label: { marginTop: 4, fontSize: 12 },
});
