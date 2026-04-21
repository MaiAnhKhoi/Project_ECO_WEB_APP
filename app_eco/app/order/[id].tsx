import "@/global.css";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  OrderCancelSheet,
  OrderStatusBadge,
} from "@/components/orders";
import { PayOSPaymentSheet } from "@/components/payos/PayOSPaymentSheet";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { orderApi } from "@/services/orderApi";
import { refreshOrderAttentionBadges } from "@/services/orderAttentionBadge";
import { useAuthStore } from "@/store/authStore";
import {
  canCancelOrder,
  canShowPayOSRetryPay,
  getPaymentMethodLabel,
  getPaymentStatusDisplayLabel,
  getShippingStatusDisplayLabel,
  needsRefundInfo,
  type OrderDetail,
  type OrderSummary,
} from "@/types/order";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { resolveAssetUrl } from "@/utils/assetUrl";
import {
  clearPendingPayOS,
  loadPendingPayOS,
  savePendingPayOS,
} from "@/utils/pendingPayOSStorage";
import { navLockRun } from "@/utils/navLock";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  const colors = useAppColors();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 8,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 13, color: colors.mutedText, flex: 1 }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: valueColor ?? colors.text,
          textAlign: "right",
          flex: 1.5,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useAppColors();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
          {title}
        </Text>
      </View>
      <View style={{ padding: 16 }}>{children}</View>
    </View>
  );
}

export default function OrderDetailScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const token = useAuthStore((s) => s.accessToken);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderSummary | null>(null);
  const [retryingPay, setRetryingPay] = useState(false);
  const [payosSheet, setPayosSheet] = useState<null | {
    orderId: number;
    orderCode: string;
    checkoutUrl: string | null;
    qrUrl: string | null;
    expiresAt: string | null;
    grandTotal: number;
  }>(null);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setError(null);
    try {
      const data = await orderApi.getOrderById(token, id);
      setOrder(data);
    } catch (e: any) {
      setError(e?.message || "Không tải được chi tiết đơn hàng.");
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      if (!token || !id) return;
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [token, id, load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleBack = () => navLockRun(() => router.back());

  // Đưa về dạng OrderSummary để truyền cho CancelSheet
  const orderAsSummary = useMemo<OrderSummary | null>(() => {
    if (!order) return null;
    return {
      orderId: order.orderId,
      orderCode: order.orderCode,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      grandTotal: order.grandTotal,
      createdAt: order.createdAt,
      cancelReason: order.cancelReason,
    };
  }, [order]);

  const showCancel =
    orderAsSummary != null &&
    (canCancelOrder(orderAsSummary) || needsRefundInfo(orderAsSummary));

  const canRetryPay = order != null && canShowPayOSRetryPay(order);

  const handleRetryPay = useCallback(async () => {
    if (!token || !order) return;
    try {
      setRetryingPay(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const sync = await orderApi.checkPayOSStatus(token, order.orderId);
      const paySt = sync.paymentStatus?.toLowerCase() ?? "";
      if (
        !sync.canRePay ||
        sync.orderStatus?.toLowerCase() !== "pending" ||
        (paySt !== "unpaid" && paySt !== "failed")
      ) {
        Alert.alert(
          "Không thể thanh toán lại",
          "Đơn hàng này không còn có thể thanh toán. Vui lòng tạo đơn mới.",
        );
        return;
      }

      let checkoutUrl: string | null = null;
      let qrUrl: string | null = null;
      let expiresAt: string | null = sync.paymentExpiresAt ?? null;

      const pending = await loadPendingPayOS();
      if (
        pending &&
        pending.orderId === order.orderId &&
        (pending.checkoutUrl || pending.qrUrl)
      ) {
        checkoutUrl = pending.checkoutUrl;
        qrUrl = pending.qrUrl;
        expiresAt = expiresAt ?? pending.expiresAt ?? null;
      } else {
        const data = await orderApi.repayWithPayOS(token, order.orderId);
        if (!data.payosCheckoutUrl && !data.payosQrUrl) {
          Alert.alert("Lỗi", "Không tạo được liên kết thanh toán. Vui lòng thử lại.");
          return;
        }
        checkoutUrl = data.payosCheckoutUrl ?? null;
        qrUrl = data.payosQrUrl ?? null;
        expiresAt = data.paymentExpiresAt ?? expiresAt;
        await savePendingPayOS({
          from: "orders",
          orderId: order.orderId,
          checkoutUrl,
          qrUrl,
          expiresAt,
        });
      }

      setPayosSheet({
        orderId: order.orderId,
        orderCode: order.orderCode,
        checkoutUrl,
        qrUrl,
        expiresAt,
        grandTotal: order.grandTotal,
      });
    } catch (err: unknown) {
      Alert.alert(
        "Lỗi",
        getApiErrorMessage(err, "Không thể thực hiện thanh toán lại. Vui lòng thử lại."),
      );
    } finally {
      setRetryingPay(false);
    }
  }, [token, order]);

  const totalQty =
    order?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const payMethodLabel = order
    ? getPaymentMethodLabel(order.paymentMethod) ?? "—"
    : "—";

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceMuted }}>
      {/* ── Top bar ── */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingBottom: 14,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CustomIconButton onPress={handleBack} accessibilityLabel="Quay lại">
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {order ? order.orderCode : "Chi tiết đơn hàng"}
          </Text>
          {order ? (
            <Text style={{ fontSize: 12, color: colors.mutedText, marginTop: 1 }}>
              {formatDate(order.createdAt)}
            </Text>
          ) : null}
        </View>
        {order ? (
          <OrderStatusBadge status={order.status} kind="order" />
        ) : null}
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LoadingSpinner visible fullscreen={false} style={{ flex: 1 }} />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <AppIcon name="alert-circle" size={48} color={colors.mutedText} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Không tải được đơn hàng
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.mutedText,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          <View style={{ marginTop: 20, width: 220 }}>
            <CustomButton title="Thử lại" onPress={load} />
          </View>
        </View>
      ) : order ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 32 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          {/* ── Lý do hủy ── */}
          {order.cancelReason ? (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <AppIcon name="info" size={14} color="#DC2626" style={{ marginTop: 1 }} />
              <Text style={{ flex: 1, fontSize: 13, color: "#DC2626" }}>
                {order.cancelReason}
              </Text>
            </View>
          ) : null}

          {/* ── Thông tin đơn ── */}
          <SectionCard title="Thông tin đơn hàng">
            <InfoRow label="Mã đơn" value={order.orderCode} />
            <InfoRow label="Ngày đặt" value={formatDate(order.createdAt)} />
            <InfoRow label="Phương thức thanh toán" value={payMethodLabel} />
            <InfoRow
              label="Trạng thái thanh toán"
              value={getPaymentStatusDisplayLabel(order.paymentStatus)}
            />
            {order.shippingStatus ? (
              <InfoRow
                label="Vận chuyển"
                value={getShippingStatusDisplayLabel(order.shippingStatus)}
              />
            ) : null}
            {order.note ? (
              <InfoRow label="Ghi chú" value={order.note} />
            ) : null}
          </SectionCard>

          {/* ── Địa chỉ giao hàng ── */}
          <SectionCard title="Địa chỉ giao hàng">
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 4,
              }}
            >
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </Text>
            <Text
              style={{ fontSize: 13, color: colors.mutedText, marginBottom: 2 }}
            >
              {order.shippingAddress.phone}
            </Text>
            <Text style={{ fontSize: 13, color: colors.text }}>
              {order.shippingAddress.address1}
            </Text>
            <Text style={{ fontSize: 13, color: colors.text }}>
              {order.shippingAddress.city}
              {order.shippingAddress.province
                ? `, ${order.shippingAddress.province}`
                : ""}
              {" — "}
              {order.shippingAddress.region}
            </Text>
            {order.shippingAddress.company ? (
              <Text style={{ fontSize: 12, color: colors.mutedText, marginTop: 4 }}>
                {order.shippingAddress.company}
              </Text>
            ) : null}
          </SectionCard>

          {/* ── Sản phẩm ── */}
          <SectionCard title={`Sản phẩm (${totalQty} món)`}>
            {order.items.map((item, idx) => {
              const thumb = item.imageUrl
                ? (resolveAssetUrl(item.imageUrl) ?? item.imageUrl)
                : null;
              const isLast = idx === order.items.length - 1;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    navLockRun(() =>
                      router.push(`/product/${item.productId}` as any),
                    )
                  }
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    paddingVertical: 10,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: colors.border,
                  }}
                  className="active:opacity-75"
                >
                  {thumb ? (
                    <Image
                      source={{ uri: thumb }}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 10,
                        backgroundColor: colors.surfaceMuted,
                      }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 10,
                        backgroundColor: colors.surfaceMuted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppIcon name="image" size={28} color={colors.mutedText} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.text,
                      }}
                      numberOfLines={2}
                    >
                      {item.productName}
                    </Text>
                    {item.variantLabel ? (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.mutedText,
                          marginTop: 2,
                        }}
                      >
                        {item.variantLabel}
                      </Text>
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ fontSize: 12, color: colors.mutedText }}
                      >
                        x{item.quantity}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {item.lineTotal.toLocaleString("vi-VN")}₫
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </SectionCard>

          {/* ── Tóm tắt thanh toán ── */}
          <SectionCard title="Tóm tắt thanh toán">
            <InfoRow
              label="Tạm tính"
              value={`${order.subtotal.toLocaleString("vi-VN")}₫`}
            />
            {order.shippingFee > 0 ? (
              <InfoRow
                label="Phí vận chuyển"
                value={`${order.shippingFee.toLocaleString("vi-VN")}₫`}
              />
            ) : (
              <InfoRow label="Phí vận chuyển" value="Miễn phí" valueColor="#059669" />
            )}
            {order.discountTotal > 0 ? (
              <InfoRow
                label="Giảm giá"
                value={`-${order.discountTotal.toLocaleString("vi-VN")}₫`}
                valueColor="#059669"
              />
            ) : null}
            {order.taxTotal > 0 ? (
              <InfoRow
                label="Thuế"
                value={`${order.taxTotal.toLocaleString("vi-VN")}₫`}
              />
            ) : null}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
                marginTop: 2,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>
                Tổng cộng
              </Text>
              <Text style={{ fontSize: 17, fontWeight: "800", color: colors.tint }}>
                {order.grandTotal.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </SectionCard>

          {/* ── Actions ── */}
          <View style={{ gap: 10 }}>
            {canRetryPay && order.paymentExpiresAt ? (
              <View
                style={{
                  backgroundColor: `${colors.tint}12`,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderColor: `${colors.tint}30`,
                }}
              >
                <AppIcon name="clock" size={18} color={colors.tint} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: colors.mutedText }}>
                    Cần thanh toán trước thời điểm
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: colors.tint,
                      marginTop: 2,
                    }}
                  >
                    {formatDate(order.paymentExpiresAt)}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Thanh toán lại */}
            {canRetryPay ? (
              <Pressable
                onPress={handleRetryPay}
                disabled={retryingPay}
                accessibilityLabel={`Thanh toán chuyển khoản cho đơn ${order.orderCode}`}
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  paddingVertical: 15,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  backgroundColor: colors.tint,
                  opacity: retryingPay ? 0.7 : 1,
                }}
                className="active:opacity-80"
              >
                {retryingPay ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <AppIcon name="credit-card" size={18} color="#fff" />
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                      Thanh toán chuyển khoản
                    </Text>
                  </View>
                )}
                {!retryingPay ? (
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.92)" }}>
                    Mã đơn {order.orderCode}
                  </Text>
                ) : null}
              </Pressable>
            ) : null}

            {/* Hủy đơn */}
            {showCancel && orderAsSummary ? (
              <CustomButton
                title={needsRefundInfo(orderAsSummary) ? "Cung cấp thông tin hoàn tiền" : "Hủy đơn hàng"}
                variant="secondary"
                titleColor="#DC2626"
                style={{
                  borderRadius: 14,
                  backgroundColor: "#FEF2F2",
                  borderWidth: 1,
                  borderColor: "#FECACA",
                }}
                onPress={() => setCancelTarget(orderAsSummary)}
              />
            ) : null}
          </View>
        </ScrollView>
      ) : null}

      {/* ── Cancel sheet ── */}
      <OrderCancelSheet
        order={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onSuccess={() => {
          setCancelTarget(null);
          load();
        }}
      />

      <PayOSPaymentSheet
        visible={payosSheet != null}
        orderId={payosSheet?.orderId ?? 0}
        orderCode={payosSheet?.orderCode ?? null}
        checkoutUrl={payosSheet?.checkoutUrl ?? null}
        qrContent={payosSheet?.qrUrl ?? null}
        expiresAt={payosSheet?.expiresAt ?? null}
        onClose={() => {
          setPayosSheet(null);
          void load();
        }}
        onPaidSuccess={() => {
          if (!payosSheet || !token) return;
          const { orderId, orderCode, grandTotal: gt } = payosSheet;
          void clearPendingPayOS();
          setPayosSheet(null);
          void refreshOrderAttentionBadges(token);
          router.replace({
            pathname: "/order-success",
            params: {
              orderId: String(orderId),
              orderCode,
              paymentMethod: "PAYOS",
              grandTotal: String(gt),
            },
          } as any);
        }}
        checkPayOSStatus={(oid) => orderApi.checkPayOSStatus(token!, oid)}
      />
    </View>
  );
}
