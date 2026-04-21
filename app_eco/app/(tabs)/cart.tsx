import "@/global.css";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import { AppScreenShell } from "@/components/layout";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { CartRoundCheckbox } from "@/components/cart/CartRoundCheckbox";
import { CartScreenHeader } from "@/components/cart/CartScreenHeader";
import { CustomButton } from "@/components/ui/CustomButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cartApi } from "@/services/cartApi";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAuthStore } from "@/store/authStore";
import { useCartStore, type GuestCartItem } from "@/store/cartStore";
import type { CartItem, CartVariantOption } from "@/types/cart";
import type { Product } from "@/types/product";
import { variantOptionsFromProduct } from "@/utils/cartVariants";
import { navLockRun } from "@/utils/navLock";

const BTN_RADIUS = 16;

type CartRow = {
  rowKey: string;
  id: number;
  productId: number;
  productName: string;
  imgSrc?: string | null;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  maxQuantity?: number;
  variantId: number | null;
  variantOptions?: CartVariantOption[];
};

function fromServerItem(item: CartItem): CartRow {
  return {
    rowKey: `s-${item.id}`,
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    imgSrc: item.imgSrc,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
    maxQuantity: item.maxQuantity,
    variantId: item.variantId ?? null,
    variantOptions: item.variantOptions,
  };
}

function fromGuestItem(item: GuestCartItem, idx: number): CartRow {
  return {
    rowKey: `g-${item.productId}-${item.variantId ?? "none"}-${item.color ?? "none"}-${idx}`,
    id: idx,
    productId: item.productId,
    productName: item.productName ?? `Sản phẩm #${item.productId}`,
    imgSrc: item.imgSrc,
    price: item.price ?? 0,
    quantity: item.quantity,
    color: item.color,
    size: null,
    maxQuantity: undefined,
    variantId: item.variantId ?? null,
    variantOptions: undefined,
  };
}

export default function CartScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const token = useAuthStore((s) => s.accessToken);
  const isLoggedIn = !!token;

  const serverCart = useCartStore((s) => s.serverCart);
  const guestItems = useCartStore((s) => s.guestItems);
  const setServerCart = useCartStore((s) => s.setServerCart);
  const updateGuestQty = useCartStore((s) => s.updateGuestQty);
  const removeGuestItem = useCartStore((s) => s.removeGuestItem);
  const changeGuestItemVariant = useCartStore((s) => s.changeGuestItemVariant);

  const colors = useAppColors();
  const [refreshing, setRefreshing] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [guestProductMap, setGuestProductMap] = useState<Record<number, Product>>({});
  /** Dòng được tick để thanh toán (theo `rowKey`) */
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());

  const guestProductIdsKey = useMemo(
    () =>
      [...new Set(guestItems.map((i) => i.productId))]
        .sort((a, b) => a - b)
        .join(","),
    [guestItems]
  );

  useEffect(() => {
    if (isLoggedIn) {
      setGuestProductMap({});
      return;
    }
    if (!guestProductIdsKey) {
      setGuestProductMap({});
      return;
    }
    let cancelled = false;
    const ids = guestProductIdsKey.split(",").map((x) => Number(x));
    (async () => {
      try {
        const { getProductDetail } = await import("@/services/productService");
        const results = await Promise.allSettled(ids.map((id) => getProductDetail(id)));
        if (cancelled) return;
        const next: Record<number, Product> = {};
        ids.forEach((id, i) => {
          const r = results[i];
          if (r.status === "fulfilled") next[id] = r.value;
        });
        setGuestProductMap(next);
      } catch {
        if (!cancelled) setGuestProductMap({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, guestProductIdsKey]);

  const fetchServerCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await cartApi.getMyCart(token);
      setServerCart(res as any);
    } catch {
      // silent
    }
  }, [token, setServerCart]);

  /** Mỗi lần vào tab Giỏ: tải lại từ server (tránh giỏ trống sau khi thêm ở màn khác). */
  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      fetchServerCart();
    }, [token, fetchServerCart]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServerCart();
    setRefreshing(false);
  }, [fetchServerCart]);

  const rows: CartRow[] = useMemo(() => {
    if (isLoggedIn) {
      return (serverCart?.items ?? []).map(fromServerItem);
    }
    return guestItems.map((item, idx) => {
      const base = fromGuestItem(item, idx);
      const product = guestProductMap[item.productId];
      const built = product ? variantOptionsFromProduct(product) : [];
      return {
        ...base,
        variantOptions: built.length > 0 ? built : undefined,
        maxQuantity:
          built.find((o) => o.variantId === (item.variantId ?? -1))?.maxQuantity ?? base.maxQuantity,
      };
    });
  }, [isLoggedIn, serverCart, guestItems, guestProductMap]);

  const rowsKey = useMemo(() => rows.map((r) => r.rowKey).join("\0"), [rows]);

  useEffect(() => {
    setSelectedKeys(new Set(rows.map((r) => r.rowKey)));
  }, [rowsKey]);

  /** Tạm tính chỉ các món đã chọn (giống Shopee) */
  const selectedSubtotal = useMemo(
    () =>
      rows
        .filter((r) => selectedKeys.has(r.rowKey))
        .reduce((sum, r) => sum + r.price * r.quantity, 0),
    [rows, selectedKeys]
  );

  const selectedQty = useMemo(
    () =>
      rows.filter((r) => selectedKeys.has(r.rowKey)).reduce((sum, r) => sum + r.quantity, 0),
    [rows, selectedKeys]
  );

  const totalQty = rows.reduce((sum, r) => sum + r.quantity, 0);
  const allRowsSelected = rows.length > 0 && selectedKeys.size === rows.length;
  const someRowsSelected = selectedKeys.size > 0 && selectedKeys.size < rows.length;

  const toggleSelectRow = useCallback((rowKey: string) => {
    Haptics.selectionAsync();
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    Haptics.selectionAsync();
    setSelectedKeys((prev) => {
      if (rows.length > 0 && prev.size === rows.length) {
        return new Set();
      }
      return new Set(rows.map((r) => r.rowKey));
    });
  }, [rows]);

  const handleBack = useCallback(() => {
    navLockRun(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      router.push("/(tabs)/shop" as any);
    });
  }, [navigation, router]);

  const handleRemove = useCallback(
    async (row: CartRow) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isLoggedIn) {
        setMutatingId(row.rowKey);
        try {
          const res = await cartApi.removeItem(token!, row.id);
          setServerCart(res as any);
        } catch {
          Alert.alert("Lỗi", "Không thể xoá sản phẩm.");
        } finally {
          setMutatingId(null);
        }
      } else {
        removeGuestItem(row.productId, row.variantId ?? null, row.color ?? null);
      }
    },
    [isLoggedIn, token, setServerCart, removeGuestItem]
  );

  const handleIncrease = useCallback(
    async (row: CartRow) => {
      if (isLoggedIn) {
        setMutatingId(row.rowKey);
        try {
          const res = await cartApi.updateItem(token!, row.id, { quantity: row.quantity + 1 });
          setServerCart(res as any);
        } catch {
          Alert.alert("Lỗi", "Không thể cập nhật số lượng.");
        } finally {
          setMutatingId(null);
        }
      } else {
        updateGuestQty(row.productId, row.quantity + 1, row.variantId ?? null, row.color ?? null);
        Haptics.selectionAsync();
      }
    },
    [isLoggedIn, token, setServerCart, updateGuestQty]
  );

  const handleDecrease = useCallback(
    async (row: CartRow) => {
      if (row.quantity <= 1) {
        handleRemove(row);
        return;
      }
      if (isLoggedIn) {
        setMutatingId(row.rowKey);
        try {
          const res = await cartApi.updateItem(token!, row.id, { quantity: row.quantity - 1 });
          setServerCart(res as any);
        } catch {
          Alert.alert("Lỗi", "Không thể cập nhật số lượng.");
        } finally {
          setMutatingId(null);
        }
      } else {
        updateGuestQty(row.productId, row.quantity - 1, row.variantId ?? null, row.color ?? null);
        Haptics.selectionAsync();
      }
    },
    [isLoggedIn, token, setServerCart, updateGuestQty, handleRemove]
  );

  const handleVariantChange = useCallback(
    async (row: CartRow, opt: CartVariantOption) => {
      if (row.variantId === opt.variantId) return;
      Haptics.selectionAsync();
      if (isLoggedIn) {
        setMutatingId(row.rowKey);
        try {
          const cap = opt.maxQuantity ?? row.quantity;
          const nextQty = Math.min(row.quantity, cap);
          const res = await cartApi.updateItem(token!, row.id, {
            variantId: opt.variantId,
            quantity: nextQty,
          });
          setServerCart(res as any);
        } catch {
          Alert.alert("Lỗi", "Không thể đổi phiên bản.");
        } finally {
          setMutatingId(null);
        }
      } else {
        changeGuestItemVariant(
          { productId: row.productId, variantId: row.variantId, color: row.color },
          {
            variantId: opt.variantId,
            color: opt.color,
            price: opt.price,
            maxQuantity: opt.maxQuantity,
            imgSrc: opt.imageUrl ?? undefined,
            productName: row.productName,
          }
        );
      }
    },
    [isLoggedIn, token, setServerCart, changeGuestItemVariant]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert("Xoá tất cả?", "Bạn có chắc muốn xoá toàn bộ giỏ hàng?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          if (isLoggedIn) {
            for (const r of rows) {
              try {
                await cartApi.removeItem(token!, r.id);
              } catch {}
            }
            fetchServerCart();
          } else {
            useCartStore.getState().clearGuestCart();
          }
        },
      },
    ]);
  }, [isLoggedIn, rows, token, fetchServerCart]);

  const handleCheckout = useCallback(() => {
    if (selectedKeys.size === 0) {
      Alert.alert("Chưa chọn sản phẩm", "Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    if (!isLoggedIn) {
      Alert.alert("Đăng nhập", "Vui lòng đăng nhập để thanh toán.", [
        { text: "Huỷ", style: "cancel" },
        { text: "Đăng nhập", onPress: () => router.push("/auth/login" as any) },
      ]);
      return;
    }
    navLockRun(() => router.push("/checkout" as any));
  }, [isLoggedIn, router, selectedKeys.size]);

  const isLoading = isLoggedIn && !serverCart && !refreshing;

  return (
    <AppScreenShell
      header={
        <CartScreenHeader
          title="Giỏ hàng"
          subtitle={rows.length > 0 ? `${totalQty} món` : undefined}
          onBack={handleBack}
        />
      }
    >
      {isLoading ? (
        <View className="flex-1">
          <LoadingSpinner visible fullscreen={false} style={{ flex: 1 }} />
        </View>
      ) : rows.length === 0 ? (
        <CartEmptyState onShop={() => router.push("/(tabs)/shop" as any)} />
      ) : (
        <FlatList
            data={rows}
            keyExtractor={(r) => r.rowKey}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 32,
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={isLoggedIn ? onRefresh : undefined}
            ListHeaderComponent={
              <View className="mb-2 flex-row items-center justify-between pb-1">
                <Pressable
                  onPress={toggleSelectAll}
                  className="flex-row items-center gap-2.5 active:opacity-80"
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: allRowsSelected,
                  }}
                  accessibilityLabel={
                    allRowsSelected ? "Bỏ chọn tất cả" : "Chọn tất cả sản phẩm"
                  }
                >
                  <CartRoundCheckbox
                    nonInteractive
                    checked={allRowsSelected}
                    indeterminate={someRowsSelected}
                  />
                  <Text
                    className="text-[14px] font-medium"
                    style={{ color: colors.text }}
                  >
                    Chọn tất cả
                  </Text>
                </Pressable>
                <CustomButton
                  title="Xoá tất cả"
                  variant="secondary"
                  onPress={handleClearAll}
                  titleStyle={{ fontSize: 14, fontWeight: "600" }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: BTN_RADIUS,
                  }}
                  accessibilityLabel="Xoá tất cả sản phẩm trong giỏ"
                />
              </View>
            }
            renderItem={({ item: row }) => {
              const { rowKey, ...cardBase } = row;
              const multi =
                Array.isArray(row.variantOptions) && row.variantOptions.length > 1;
              return (
                <View style={{ opacity: mutatingId === rowKey ? 0.55 : 1 }}>
                  <CartItemCard
                    {...cardBase}
                    selectedVariantId={row.variantId}
                    onSelectVariant={multi ? (opt) => handleVariantChange(row, opt) : undefined}
                    checkoutSelected={selectedKeys.has(rowKey)}
                    onToggleCheckout={() => toggleSelectRow(rowKey)}
                    disabled={mutatingId === rowKey}
                    onIncrease={() => handleIncrease(row)}
                    onDecrease={() => handleDecrease(row)}
                    onRemove={() => handleRemove(row)}
                    onPress={() => router.push(`/product/${row.productId}` as any)}
                  />
                </View>
              );
            }}
            ListFooterComponent={
              <CartOrderSummary
                subtotal={selectedSubtotal}
                itemCount={selectedQty}
                onCheckout={handleCheckout}
                disabled={rows.length === 0 || selectedKeys.size === 0}
              />
            }
          />
        )}
    </AppScreenShell>
  );
}
