import "@/global.css";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";

import { AppScreenShell } from "@/components/layout";
import { SimpleScreenHeader } from "@/components/navigation/SimpleScreenHeader";
import {
  OrderCard,
  OrderCancelSheet,
  OrderFilterTabs,
} from "@/components/orders";
import { PayOSPaymentSheet } from "@/components/payos/PayOSPaymentSheet";
import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";
import { ListFooter } from "@/components/ui/ListFooter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { usePagedList } from "@/hooks/usePagedList";
import { orderApi } from "@/services/orderApi";
import { refreshOrderAttentionBadges } from "@/services/orderAttentionBadge";
import { useAuthStore } from "@/store/authStore";
import { useOrderAttentionStore } from "@/store/orderAttentionStore";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import {
  clearPendingPayOS,
  loadPendingPayOS,
  savePendingPayOS,
} from "@/utils/pendingPayOSStorage";
import { navLockRun } from "@/utils/navLock";
import { type OrderSummary, type OrderTabKey } from "@/types/order";

const PAGE_SIZE = 10;

export default function OrdersScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const navigation = useNavigation();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const orderTabCounts = useOrderAttentionStore((s) => s.orderTabCounts);
  const redirectedRef = useRef(false);

  // ── Auth guard ──
  useEffect(() => {
    if (!user) {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      navLockRun(() =>
        router.push({
          pathname: "/auth/login",
          params: { next: "/(tabs)/orders" },
        } as any),
      );
    }
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<OrderTabKey>("all");
  const [cancelTarget, setCancelTarget] = useState<OrderSummary | null>(null);
  const [payosSheet, setPayosSheet] = useState<null | {
    orderId: number;
    orderCode: string;
    checkoutUrl: string | null;
    qrUrl: string | null;
    expiresAt: string | null;
    grandTotal: number;
  }>(null);

  // ── PayOS restore khi vào tab Đơn hàng ──
  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      let cancelled = false;
      void (async () => {
        const saved = await loadPendingPayOS();
        if (cancelled || !saved?.orderId || (!saved.checkoutUrl && !saved.qrUrl)) return;
        try {
          const sync = await orderApi.checkPayOSStatus(token, saved.orderId);
          if (cancelled) return;
          const unpaid = sync.paymentStatus?.toLowerCase() === "unpaid";
          const pending = sync.orderStatus?.toLowerCase() === "pending";
          if (unpaid && pending) {
            const detail = await orderApi.getOrderById(token, saved.orderId);
            if (cancelled) return;
            setPayosSheet({
              orderId: saved.orderId,
              orderCode: detail.orderCode,
              checkoutUrl: saved.checkoutUrl,
              qrUrl: saved.qrUrl,
              expiresAt: sync.paymentExpiresAt ?? saved.expiresAt ?? null,
              grandTotal: detail.grandTotal,
            });
          } else {
            await clearPendingPayOS();
          }
        } catch {
          await clearPendingPayOS();
        }
        if (!cancelled) void refreshOrderAttentionBadges(token);
      })();
      return () => {
        cancelled = true;
      };
    }, [token]),
  );

  // ── Pagination — fetchFn thay đổi khi token/activeTab thay đổi → tự reset ──
  const fetchFn = useCallback(
    (page: number) =>
      orderApi.getMyOrders(
        token!,
        page,
        PAGE_SIZE,
        activeTab === "all" ? undefined : activeTab,
      ),
    [token, activeTab],
  );

  const {
    items: orders,
    totalElements,
    initialLoading,
    loadingMore,
    refreshing,
    hasMore,
    onRefresh: refreshOrders,
    onLoadMore,
  } = usePagedList<OrderSummary>(fetchFn, {
    pageSize: PAGE_SIZE,
    getKey: (o) => o.orderId,
    enabled: !!token,
  });

  /** Wrap để vừa refresh danh sách vừa đồng bộ badge attention */
  const onRefresh = useCallback(async () => {
    await refreshOrders();
    if (token) void refreshOrderAttentionBadges(token);
  }, [refreshOrders, token]);

  /** Refetch mỗi lần quay lại tab (bỏ qua focus đầu tiên — tránh đụng với initial load) */
  const refetchOnFocusRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      if (!refetchOnFocusRef.current) {
        refetchOnFocusRef.current = true;
        return;
      }
      void onRefresh();
    }, [token, onRefresh]),
  );

  // ── Handlers ──
  const handleBack = useCallback(() => {
    navLockRun(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      router.push("/(tabs)/index" as any);
    });
  }, [navigation, router]);

  const handleTabChange = useCallback((key: OrderTabKey) => {
    setActiveTab(key);
  }, []);

  const handleRetryPay = useCallback(
    async (order: OrderSummary) => {
      if (!token) return;
      try {
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
            "Đơn hàng này không còn có thể thanh toán. Vui lòng xem chi tiết.",
          );
          return;
        }

        let checkoutUrl: string | null = null;
        let qrUrl: string | null = null;
        let expiresAt: string | null = sync.paymentExpiresAt ?? null;

        const pending = await loadPendingPayOS();
        if (pending && pending.orderId === order.orderId && (pending.checkoutUrl || pending.qrUrl)) {
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
          getApiErrorMessage(err, "Không thể thực hiện thanh toán lại."),
        );
      }
    },
    [token],
  );

  if (!user) return null;

  const subtitle = !initialLoading && totalElements > 0 ? `${totalElements} đơn hàng` : undefined;

  return (
    <AppScreenShell
      header={
        <SimpleScreenHeader
          title="Đơn hàng của tôi"
          subtitle={subtitle}
          onBack={handleBack}
        />
      }
      stickyBelowHeader={
        <OrderFilterTabs
          active={activeTab}
          onChange={handleTabChange}
          counts={orderTabCounts}
        />
      }
      overlay={
        <>
          <OrderCancelSheet
            order={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onSuccess={() => {
              setCancelTarget(null);
              void onRefresh();
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
              void onRefresh();
            }}
            onPaidSuccess={() => {
              if (!payosSheet || !token) return;
              const { orderId, orderCode, grandTotal: gt } = payosSheet;
              void clearPendingPayOS();
              setPayosSheet(null);
              void refreshOrderAttentionBadges(token);
              router.push({
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
        </>
      }
    >
      {initialLoading ? (
        <View className="flex-1">
          <LoadingSpinner
            visible
            fullscreen={false}
            style={{ flex: 1, justifyContent: "center" }}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => String(o.orderId)}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
          onEndReached={() => void onLoadMore()}
          onEndReachedThreshold={0.25}
          ListEmptyComponent={
            <EmptyStateBlock
              iconName="shopping-bag"
              sectionLabel="Đơn hàng"
              title={
                activeTab === "all"
                  ? "Bạn chưa có đơn hàng nào"
                  : "Không có đơn hàng phù hợp"
              }
              description={
                activeTab === "all"
                  ? "Bắt đầu mua sắm và đơn hàng của bạn sẽ xuất hiện ở đây."
                  : "Không có đơn hàng nào ở trạng thái này."
              }
              action={
                activeTab === "all"
                  ? {
                      label: "Mua sắm ngay",
                      onPress: () =>
                        navLockRun(() => router.push("/(tabs)/shop" as any)),
                    }
                  : undefined
              }
            />
          }
          ListFooterComponent={
            <ListFooter
              loadingMore={loadingMore}
              hasMore={hasMore}
              loadedCount={orders.length}
              totalElements={totalElements}
              unit="đơn hàng"
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={(o) =>
                navLockRun(() => router.push(`/order/${o.orderId}` as any))
              }
              onCancel={(o) => setCancelTarget(o)}
              onRetryPay={(o) => handleRetryPay(o)}
            />
          )}
        />
      )}
    </AppScreenShell>
  );
}
