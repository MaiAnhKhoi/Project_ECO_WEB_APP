import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MenuItem } from "@/components/ui/MenuItem";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";
import { useAsideStore } from "@/store/asideStore";
import { useAuthStore } from "@/store/authStore";

type MenuEntry = {
  label: string;
  href: string;
  icon: React.ComponentProps<typeof AppIcon>["name"];
};

const MENU_ITEMS: MenuEntry[] = [
  { label: "Hồ sơ", href: "/profile", icon: "user" },
  { label: "Địa chỉ", href: "/addresses", icon: "map-pin" },
  { label: "Danh sách yêu thích", href: "/(tabs)/wishlist", icon: "heart" },
  { label: "Đơn hàng của tôi", href: "/(tabs)/orders", icon: "package" },
  { label: "Thông báo", href: "/notifications", icon: "bell" },
  { label: "Đánh giá của tôi", href: "/my-reviews", icon: "star" },
  { label: "Chat AI", href: "/ai-chat", icon: "message-circle" },
  { label: "AI Stylist", href: "/ai-stylist", icon: "layers" },
  { label: "Blog", href: "/blog", icon: "book-open" },
  { label: "Giới thiệu", href: "/about", icon: "info" },
  { label: "Liên hệ", href: "/contact", icon: "phone" },
];

/** Tên hiển thị — sau này có thể lấy từ API / storage */
const DEFAULT_DISPLAY_NAME = "Khách hàng";

export default function HeaderAside() {
  const isOpen = useAsideStore((s) => s.isOpen);
  const closeAside = useAsideStore((s) => s.closeAside);
  const router = useRouter();
  const colors = useAppColors();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);
  const displayName = user?.name || DEFAULT_DISPLAY_NAME;

  // Đóng aside sau khi điều hướng "commit" để tránh lộ màn Home trong lúc modal trượt xuống
  const closeAfterNav = useCallback(() => {
    // Modal slide-down có animation; giữ aside che màn hình một chút để route mới render xong,
    // khi aside biến mất sẽ thấy thẳng màn đích (không bị ló Home).
    setTimeout(() => closeAside(), 380);
  }, [closeAside]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [isOpen]);

  const go = useCallback(
    (href: string) => {
      navLockRun(() => {
        const protectedRoutes = [
          "/profile",
          "/addresses",
          "/my-reviews",
          "/(tabs)/orders",
          "/(tabs)/wishlist",
        ];
        if (!user && protectedRoutes.includes(href)) {
          closeAside();
          router.push({ pathname: "/auth/login", params: { next: href } } as any);
          return;
        }
        if (href === "/profile") {
          router.push({ pathname: "/profile", params: { from: "aside" } } as any);
          closeAfterNav();
          return;
        }
        if (href === "/addresses") {
          router.push({ pathname: "/addresses", params: { from: "aside" } } as any);
          closeAfterNav();
          return;
        }
        if (href === "/blog") {
          router.push({ pathname: "/blog", params: { from: "aside" } } as any);
          closeAfterNav();
          return;
        }
        if (href === "/about") {
          router.push({ pathname: "/about", params: { from: "aside" } } as any);
          closeAfterNav();
          return;
        }
        if (href === "/contact") {
          router.push({ pathname: "/contact", params: { from: "aside" } } as any);
          closeAfterNav();
          return;
        }
        router.push(href as any);
        closeAfterNav();
      });
    },
    [closeAfterNav, closeAside, router, user]
  );

  const onLogout = useCallback(() => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          navLockRun(() => {
            closeAside();
            logout();
            // Tránh bị kẹt ở màn cần đăng nhập (dẫn tới trắng)
            router.replace("/(tabs)" as any);
          });
        },
      },
    ]);
  }, [closeAside, logout, router]);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle={
        Platform.OS === "ios" ? "fullScreen" : undefined
      }
      onRequestClose={closeAside}
      statusBarTranslucent={false}
    >
      {/*
        Modal render ngoài cây React chính — cần SafeAreaProvider riêng
        thì SafeAreaView mới có inset đúng (tai thỏ / status bar / home indicator).
      */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.background }}
          edges={["top", "left", "right", "bottom"]}
        >
          <LoadingSpinner visible={loading} message="Đang tải…" fullscreen />

          {/*
            Một ScrollView cho toàn bộ: cuộn một lần từ đầu tới cuối,
            không bị chặn bởi footer cố định — thấy hết mục + đăng xuất.
          */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 12 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            <View className="px-4 pb-2 pt-1">
              <CustomIconButton
                onPress={closeAside}
                accessibilityLabel="Quay lại"
              >
                <AppIcon name="chevron-left" size={22} color={colors.text} />
              </CustomIconButton>
            </View>

            <View className="items-center px-4 pb-2 pt-2">
              <Avatar name={displayName} size={88} />
              <Text
                className="mt-3 text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {displayName}
              </Text>
            </View>

            {MENU_ITEMS.map((item, index) => (
              <MenuItem
                key={item.href}
                label={item.label}
                icon={item.icon}
                onPress={() => go(item.href)}
                showDivider={index < MENU_ITEMS.length - 1}
              />
            ))}

            <View
              className="mt-1 border-t px-4 py-20"
              style={{ borderColor: colors.divider }}
            >
              <CustomButton
                title="Đăng xuất"
                variant="secondary"
                onPress={onLogout}
                accessibilityLabel="Đăng xuất"
                disabled={!user}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
