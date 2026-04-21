import { Tabs } from "expo-router";
import React from "react";

import Footer from "@/components/footer/Footer";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      tabBar={(props) => <Footer {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Đơn hàng",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.clipboard.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Cửa hàng",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Yêu thích",
          tabBarBadge: 0,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarBadge: 0,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
