import React from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import {
  canCancelOrder,
  canShowPayOSRetryPay,
  getPaymentMethodLabel,
  needsRefundInfo,
  type OrderSummary,
} from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = {
  order: OrderSummary;
  onPress: (order: OrderSummary) => void;
  onCancel?: (order: OrderSummary) => void;
  onRetryPay?: (order: OrderSummary) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPayosDeadline(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderCard({ order, onPress, onCancel, onRetryPay }: Props) {
  const colors = useAppColors();
  const showCancel = canCancelOrder(order) || needsRefundInfo(order);

  const canRetryPay = canShowPayOSRetryPay(order);

  const payMethodLabel = order.paymentMethod
    ? getPaymentMethodLabel(order.paymentMethod) ?? order.paymentMethod
    : null;

  return (
    <Pressable
      onPress={() => onPress(order)}
      className="active:opacity-90"
      style={{
        backgroundColor: colors.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppIcon name="shopping-bag" size={14} color={colors.mutedText} />
          <Text style={{ fontSize: 12, color: colors.mutedText, fontWeight: "500" }}>
            {order.orderCode}
          </Text>
          {payMethodLabel ? (
            <View
              style={{
                backgroundColor: `${colors.tint}18`,
                borderRadius: 99,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 10, color: colors.tint, fontWeight: "600" }}>
                {payMethodLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <OrderStatusBadge status={order.status} kind="order" size="sm" />
      </View>

      {/* ── Body ── */}
      <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
        {/* Thông tin ngày & thanh toán */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ fontSize: 12, color: colors.mutedText }}>
            {formatDate(order.createdAt)}
          </Text>
          <OrderStatusBadge status={order.paymentStatus} kind="payment" size="sm" />
        </View>

        {/* Lý do hủy nếu có */}
        {order.cancelReason ? (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <AppIcon name="info" size={13} color="#DC2626" style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 12, color: "#DC2626", flex: 1 }} numberOfLines={2}>
              {order.cancelReason}
            </Text>
          </View>
        ) : null}

        {canRetryPay && order.paymentExpiresAt ? (
          <View
            style={{
              backgroundColor: `${colors.tint}12`,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: `${colors.tint}30`,
            }}
          >
            <AppIcon name="clock" size={15} color={colors.tint} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: colors.mutedText, marginBottom: 2 }}>
                Cần thanh toán trước
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.tint }}>
                {formatPayosDeadline(order.paymentExpiresAt)}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Tổng tiền + số lượng */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {order.itemCount != null ? (
            <Text style={{ fontSize: 13, color: colors.mutedText }}>
              {order.itemCount} sản phẩm
            </Text>
          ) : (
            <View />
          )}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 11, color: colors.mutedText }}>Tổng tiền</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.tint,
              }}
            >
              {order.grandTotal.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        </View>
      </View>

      {/* ── Footer actions ── */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 14,
          paddingBottom: 12,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {/* Thanh toán lại */}
        {canRetryPay && onRetryPay ? (
          <CustomButton
            title="Thanh toán chuyển khoản"
            subtitle={`Mã đơn ${order.orderCode}`}
            onPress={() => onRetryPay(order)}
            style={{ borderRadius: 12, paddingVertical: 9, paddingHorizontal: 16 }}
            titleStyle={{ fontSize: 13 }}
            accessibilityLabel={`Thanh toán chuyển khoản cho đơn ${order.orderCode}`}
          />
        ) : null}

        <CustomButton
          title="Xem chi tiết"
          variant="secondary"
          onPress={() => onPress(order)}
          style={{ borderRadius: 12, paddingVertical: 9, paddingHorizontal: 16 }}
          titleStyle={{ fontSize: 13 }}
          accessibilityLabel="Xem chi tiết đơn hàng"
        />
        {showCancel && onCancel ? (
          <CustomButton
            title={needsRefundInfo(order) ? "Cung cấp thông tin" : "Hủy đơn"}
            variant="secondary"
            onPress={() => onCancel(order)}
            titleColor="#DC2626"
            style={{
              borderRadius: 12,
              paddingVertical: 9,
              paddingHorizontal: 16,
              backgroundColor: "#FEF2F2",
            }}
            titleStyle={{ fontSize: 13 }}
            accessibilityLabel="Hủy đơn hàng"
          />
        ) : null}
      </View>
    </Pressable>
  );
}
