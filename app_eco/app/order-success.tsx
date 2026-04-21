import "@/global.css";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { navLockRun } from "@/utils/navLock";

// Animated checkmark circle
function AnimatedCheckmark() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#D1FAE5",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: "#059669",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppIcon name="check" size={36} color="#fff" />
      </View>
    </Animated.View>
  );
}

export default function OrderSuccessScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId, orderCode, paymentMethod, grandTotal } =
    useLocalSearchParams<{
      orderId: string;
      orderCode: string;
      paymentMethod: string;
      grandTotal: string;
    }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const total = grandTotal ? parseInt(grandTotal, 10) : null;
  const isPaid = paymentMethod === "PAYOS";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
          flexGrow: 1,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon */}
        <AnimatedCheckmark />

        {/* Heading */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: colors.text,
            marginTop: 24,
            textAlign: "center",
            letterSpacing: -0.5,
          }}
        >
          Đặt hàng thành công!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.mutedText,
            marginTop: 8,
            textAlign: "center",
            lineHeight: 22,
            maxWidth: 300,
          }}
        >
          {isPaid
            ? "Thanh toán đã được ghi nhận. Cảm ơn bạn đã mua hàng!"
            : "Đơn hàng của bạn đã được đặt. Vui lòng thanh toán khi nhận hàng."}
        </Text>

        {/* Order info card */}
        <View
          style={{
            width: "100%",
            marginTop: 28,
            backgroundColor: colors.surfaceMuted,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {orderCode ? (
            <InfoItem
              icon="hash"
              label="Mã đơn hàng"
              value={orderCode}
              highlight
              colors={colors}
            />
          ) : null}

          {orderId ? (
            <InfoItem
              icon="package"
              label="ID đơn hàng"
              value={`#${orderId}`}
              colors={colors}
            />
          ) : null}

          {total !== null && !isNaN(total) ? (
            <InfoItem
              icon="wallet"
              label="Tổng thanh toán"
              value={`${total.toLocaleString("vi-VN")}₫`}
              highlight
              colors={colors}
            />
          ) : null}

          <InfoItem
            icon={isPaid ? "credit-card" : "banknote"}
            label="Phương thức thanh toán"
            value={isPaid ? "PayOS" : "Thanh toán khi nhận hàng"}
            colors={colors}
          />

          <InfoItem
            icon="truck"
            label="Trạng thái"
            value="Chờ xác nhận"
            colors={colors}
            isLast
          />
        </View>

        {/* Notice */}
        <View
          style={{
            width: "100%",
            marginTop: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
            backgroundColor: isPaid ? "#F0FDF4" : "#FFFBEB",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: isPaid ? "#BBF7D0" : "#FDE68A",
          }}
        >
          <AppIcon
            name={isPaid ? "check-circle" : "clock"}
            size={16}
            color={isPaid ? "#059669" : "#D97706"}
            style={{ marginTop: 1 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              color: isPaid ? "#065F46" : "#92400E",
              lineHeight: 20,
            }}
          >
            {isPaid
              ? "Thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng sớm nhất có thể."
              : "Vui lòng chuẩn bị tiền mặt khi nhận hàng. Chúng tôi sẽ liên hệ xác nhận sớm."}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={{ width: "100%", marginTop: 28, gap: 10 }}>
          <CustomButton
            title="Xem chi tiết đơn hàng"
            onPress={() =>
              navLockRun(() =>
                router.replace({
                  pathname: "/order/[id]",
                  params: { id: orderId ?? "" },
                } as any),
              )
            }
            style={{ borderRadius: 16, paddingVertical: 15 }}
            titleStyle={{ fontSize: 15, fontWeight: "700" }}
          />

          <Pressable
            onPress={() =>
              navLockRun(() => router.replace("/(tabs)/orders" as any))
            }
            style={{
              paddingVertical: 14,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: colors.border,
              alignItems: "center",
              backgroundColor: colors.background,
            }}
            className="active:opacity-70"
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Xem tất cả đơn hàng
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navLockRun(() => router.replace("/(tabs)/shop" as any))
            }
            style={{ paddingVertical: 14, alignItems: "center" }}
            className="active:opacity-70"
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.tint,
                fontWeight: "600",
              }}
            >
              Tiếp tục mua sắm →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoItem({
  icon,
  label,
  value,
  highlight,
  isLast,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
  isLast?: boolean;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppIcon name={icon as any} size={16} color={colors.mutedText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: colors.mutedText }}>{label}</Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: highlight ? "700" : "500",
            color: highlight ? colors.tint : colors.text,
            marginTop: 1,
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
