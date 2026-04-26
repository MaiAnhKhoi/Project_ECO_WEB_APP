import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", DATE_FORMAT);
}

const BTN_STYLE = { borderRadius: 12, paddingVertical: 9, paddingHorizontal: 16 };
const BTN_TITLE_STYLE = { fontSize: 13 };
const CANCEL_BTN_STYLE = {
  borderRadius: 12,
  paddingVertical: 9,
  paddingHorizontal: 16,
  backgroundColor: "#FEF2F2",
};

function OrderCardInner({ order, onPress, onCancel, onRetryPay }: Props) {
  const colors = useAppColors();
  const showCancel = canCancelOrder(order) || needsRefundInfo(order);
  const canRetryPay = canShowPayOSRetryPay(order);
  const payMethodLabel = order.paymentMethod
    ? (getPaymentMethodLabel(order.paymentMethod) ?? order.paymentMethod)
    : null;

  const handlePress = useCallback(() => onPress(order), [onPress, order]);
  const handleCancel = useCallback(() => onCancel?.(order), [onCancel, order]);
  const handleRetryPay = useCallback(() => onRetryPay?.(order), [onRetryPay, order]);

  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-90"
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: colors.surfaceMuted },
        ]}
      >
        <View style={styles.headerLeft}>
          <AppIcon name="shopping-bag" size={14} color={colors.mutedText} />
          <Text style={[styles.orderCode, { color: colors.mutedText }]}>
            {order.orderCode}
          </Text>
          {payMethodLabel ? (
            <View
              style={[styles.methodBadge, { backgroundColor: `${colors.tint}18` }]}
            >
              <Text style={[styles.methodBadgeText, { color: colors.tint }]}>
                {payMethodLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <OrderStatusBadge status={order.status} kind="order" size="sm" />
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        <View style={styles.dateRow}>
          <Text style={[styles.dateText, { color: colors.mutedText }]}>
            {formatDate(order.createdAt)}
          </Text>
          <OrderStatusBadge status={order.paymentStatus} kind="payment" size="sm" />
        </View>

        {order.cancelReason ? (
          <View style={styles.cancelReason}>
            <AppIcon name="info" size={13} color="#DC2626" style={styles.infoIcon} />
            <Text style={styles.cancelReasonText} numberOfLines={2}>
              {order.cancelReason}
            </Text>
          </View>
        ) : null}

        {canRetryPay && order.paymentExpiresAt ? (
          <View
            style={[
              styles.payOSDeadline,
              {
                backgroundColor: `${colors.tint}12`,
                borderColor: `${colors.tint}30`,
              },
            ]}
          >
            <AppIcon name="clock" size={15} color={colors.tint} />
            <View style={styles.deadlineInfo}>
              <Text style={[styles.deadlineLabel, { color: colors.mutedText }]}>
                Cần thanh toán trước
              </Text>
              <Text style={[styles.deadlineValue, { color: colors.tint }]}>
                {formatDate(order.paymentExpiresAt)}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
          {order.itemCount != null ? (
            <Text style={[styles.itemCount, { color: colors.mutedText }]}>
              {order.itemCount} sản phẩm
            </Text>
          ) : (
            <View />
          )}
          <View style={styles.totalAmount}>
            <Text style={[styles.totalLabel, { color: colors.mutedText }]}>
              Tổng tiền
            </Text>
            <Text style={[styles.totalValue, { color: colors.tint }]}>
              {order.grandTotal.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        </View>
      </View>

      {/* ── Footer actions ── */}
      <View style={styles.actions}>
        {canRetryPay && onRetryPay ? (
          <CustomButton
            title="Thanh toán chuyển khoản"
            subtitle={`Mã đơn ${order.orderCode}`}
            onPress={handleRetryPay}
            style={BTN_STYLE}
            titleStyle={BTN_TITLE_STYLE}
            accessibilityLabel={`Thanh toán chuyển khoản cho đơn ${order.orderCode}`}
          />
        ) : null}

        <CustomButton
          title="Xem chi tiết"
          variant="secondary"
          onPress={handlePress}
          style={BTN_STYLE}
          titleStyle={BTN_TITLE_STYLE}
          accessibilityLabel="Xem chi tiết đơn hàng"
        />
        {showCancel && onCancel ? (
          <CustomButton
            title={needsRefundInfo(order) ? "Cung cấp thông tin" : "Hủy đơn"}
            variant="secondary"
            onPress={handleCancel}
            titleColor="#DC2626"
            style={CANCEL_BTN_STYLE}
            titleStyle={BTN_TITLE_STYLE}
            accessibilityLabel="Hủy đơn hàng"
          />
        ) : null}
      </View>
    </Pressable>
  );
}

export const OrderCard = memo(OrderCardInner);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  orderCode: { fontSize: 12, fontWeight: "500" },
  methodBadge: { borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 },
  methodBadgeText: { fontSize: 10, fontWeight: "600" },
  body: { paddingHorizontal: 14, paddingVertical: 12 },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateText: { fontSize: 12 },
  cancelReason: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  infoIcon: { marginTop: 1 },
  cancelReasonText: { fontSize: 12, color: "#DC2626", flex: 1 },
  payOSDeadline: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  deadlineInfo: { flex: 1 },
  deadlineLabel: { fontSize: 11, marginBottom: 2 },
  deadlineValue: { fontSize: 13, fontWeight: "700" },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  itemCount: { fontSize: 13 },
  totalAmount: { alignItems: "flex-end" },
  totalLabel: { fontSize: 11 },
  totalValue: { fontSize: 16, fontWeight: "700" },
  actions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
});
