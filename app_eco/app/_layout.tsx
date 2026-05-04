import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import Header from "@/components/header/Header";
import HeaderAside from "@/components/header/HeaderAside";
import { AIChatFab } from "@/components/ai/AIChatFab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppProviders } from "@/providers/AppProviders";
import { useAsideStore } from "@/store/asideStore";
import { useAuthStore } from "@/store/authStore";
import { navLockRun } from "@/utils/navLock";
import { useChatUnreadCount } from "@/hooks/useChatUnreadCount";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const openAside = useAsideStore((s) => s.openAside);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { unreadCount } = useChatUnreadCount();
  const pathname = usePathname();
  const segments = useSegments();
  /** Giỏ hàng / Yêu thích: header riêng, không Header UTE SHOP. */
  const isCartOrWishlistTab =
    pathname?.endsWith("/cart") ||
    pathname?.endsWith("/wishlist") ||
    pathname === "/cart" ||
    pathname === "/wishlist" ||
    pathname?.includes("/(tabs)/cart") ||
    pathname?.includes("/(tabs)/wishlist");
  /** Tab Cửa hàng và Đơn hàng — Trang chủ dùng lại Header toàn app như ban đầu. */
  const secondTab = (segments[0] === "(tabs)" ? segments[1] : undefined) as
    | string
    | undefined;
  const isShopTab =
    (segments[0] === "(tabs)" && secondTab === "shop") ||
    pathname === "/(tabs)/shop" ||
    pathname === "/shop" ||
    pathname?.includes("/(tabs)/shop");
  const isOrdersTab =
    (segments[0] === "(tabs)" && secondTab === "orders") ||
    pathname === "/(tabs)/orders" ||
    pathname?.includes("/(tabs)/orders");
  const isFullscreenScreen =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/addresses") ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/ai-chat") ||
    pathname?.startsWith("/ai-stylist") ||
    pathname?.startsWith("/ai-outfit") ||
    pathname?.startsWith("/ai-style-analysis") ||
    pathname?.startsWith("/ai-hub") ||
    pathname?.startsWith("/ai-history") ||
    pathname?.startsWith("/search") ||
    pathname?.startsWith("/product") ||
    pathname?.startsWith("/compare") ||
    pathname?.startsWith("/review") ||
    pathname?.startsWith("/my-reviews") ||
    pathname?.startsWith("/order") ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/order-success") ||
    isCartOrWishlistTab ||
    isShopTab ||
    isOrdersTab;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1">
        {!isFullscreenScreen ? (
          <Header
            title="UTE SHOP"
            onPressLeft={() => {
            navLockRun(() => {
              if (!user) {
                router.push({
                  pathname: "/auth/login",
                  params: { next: "/(tabs)" },
                } as any);
                return;
              }
              openAside();
            });
            }}
            onPressSearch={() => {
              navLockRun(() => router.push("/search" as any));
            }}
            onPressMessage={
              user
                ? () => {
                    navLockRun(() => router.push("/chat" as any));
                  }
                : undefined
            }
            messageBadgeCount={user ? unreadCount : 0}
            onPressNotifications={() => {
            navLockRun(() => router.push("/notifications"));
            }}
          />
        ) : null}
        <View className="flex-1" style={{ position: "relative" }} collapsable={false}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="my-reviews" />
            <Stack.Screen name="review/[id]" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="blog" />
            <Stack.Screen name="about" />
            <Stack.Screen name="contact" />
            <Stack.Screen name="chat" />
          <Stack.Screen name="ai-chat" />
          <Stack.Screen name="ai-stylist" />
          <Stack.Screen name="ai-outfit/[id]" />
          <Stack.Screen name="ai-style-analysis" />
          <Stack.Screen name="ai-hub" />
            <Stack.Screen name="ai-history" />
          <Stack.Screen name="search" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="order/[id]" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-success" />
            <Stack.Screen name="compare" />
          </Stack>
          <AIChatFab />
        </View>
        {/* Luôn mount aside để có thể mở lại từ các màn fullscreen (profile/addresses) */}
        <HeaderAside />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppProviders>
        <RootLayoutInner />
      </AppProviders>
    </SafeAreaProvider>
  );
}
