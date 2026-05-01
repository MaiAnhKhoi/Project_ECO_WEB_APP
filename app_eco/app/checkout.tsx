import "@/global.css";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PayOSPaymentSheet } from "@/components/payos/PayOSPaymentSheet";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { addressApi } from "@/services/addressApi";
import type { AddressResponse } from "@/types/address";
import { couponApi } from "@/services/couponApi";
import { orderApi } from "@/services/orderApi";
import { refreshOrderAttentionBadges } from "@/services/orderAttentionBadge";
import { getProductDetail } from "@/services/productService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { CartItem } from "@/types/cart";
import type { CouponItem } from "@/types/coupon";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { clearPendingPayOS, savePendingPayOS } from "@/utils/pendingPayOSStorage";
import { resolveAssetUrl } from "@/utils/assetUrl";
import { mapProductColorsFromApi } from "@/utils/mapProductColors";
import { navLockRun } from "@/utils/navLock";

function routeParam(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v);
}

// ─── Constants ───────────────────────────────────────────────
const SHIPPING_OPTIONS = [
  {
    id: "free",
    label: "Miễn phí vận chuyển",
    description: "Giao trong 3–5 ngày làm việc",
    fee: 0,
  },
  {
    id: "express",
    label: "Chuyển nhanh",
    description: "Giao trong 1–2 ngày làm việc",
    fee: 10000,
  },
];

type PayMethod = "COD" | "PAYOS";

const PAYMENT_METHODS: {
  id: PayMethod;
  label: string;
  desc: string;
  iconName: string;
}[] = [
  {
    id: "COD",
    label: "Thanh toán khi nhận hàng",
    desc: "Trả tiền mặt khi nhận hàng",
    iconName: "banknote",
  },
  {
    id: "PAYOS",
    label: "PayOS",
    desc: "Chuyển khoản ngân hàng qua PayOS",
    iconName: "credit-card",
  },
];

// ─── Sub-components ───────────────────────────────────────────

function SectionCard({
  title,
  children,
  rightSlot,
}: {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 11,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
          {title}
        </Text>
        {rightSlot}
      </View>
      <View style={{ padding: 16 }}>{children}</View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  const colors = useAppColors();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: colors.mutedText }}>{label}</Text>
      <Text
        style={{
          fontSize: bold ? 15 : 13,
          fontWeight: bold ? "700" : "500",
          color: accent ? "#059669" : colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── AddressPicker Sheet ──────────────────────────────────────

function AddressPickerSheet({
  visible,
  addresses,
  selected,
  onSelect,
  onClose,
  onAddNew,
}: {
  visible: boolean;
  addresses: AddressResponse[];
  selected: AddressResponse | null;
  onSelect: (a: AddressResponse) => void;
  onClose: () => void;
  onAddNew: () => void;
}) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={onClose}
      />
      <View
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom + 16,
          maxHeight: "70%",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Handle bar */}
        <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 8 }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>
            Chọn địa chỉ giao hàng
          </Text>
          <CustomIconButton onPress={onClose} accessibilityLabel="Đóng">
            <AppIcon name="x" size={20} color={colors.mutedText} />
          </CustomIconButton>
        </View>

        <ScrollView
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {addresses.map((addr) => {
            const isActive = addr.id === selected?.id;
            return (
              <Pressable
                key={addr.id}
                onPress={() => {
                  onSelect(addr);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: isActive ? colors.tint : colors.border,
                  backgroundColor: isActive
                    ? `${colors.tint}10`
                    : colors.background,
                }}
                className="active:opacity-80"
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isActive ? colors.tint : colors.border,
                    backgroundColor: isActive ? colors.tint : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  {isActive && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#fff",
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      {addr.firstName} {addr.lastName}
                    </Text>
                    {addr.isDefault && (
                      <View
                        style={{
                          backgroundColor: `${colors.tint}20`,
                          borderRadius: 6,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "700",
                            color: colors.tint,
                          }}
                        >
                          Mặc định
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.mutedText,
                      marginTop: 2,
                    }}
                  >
                    {addr.phone}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      marginTop: 3,
                      lineHeight: 18,
                    }}
                  >
                    {addr.address1}, {addr.city}
                    {addr.province ? `, ${addr.province}` : ""} —{" "}
                    {addr.region}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          <Pressable
            onPress={onAddNew}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: colors.border,
            }}
            className="active:opacity-70"
          >
            <AppIcon name="plus" size={18} color={colors.tint} />
            <Text style={{ fontSize: 14, color: colors.tint, fontWeight: "600" }}>
              Thêm địa chỉ mới
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

/** Voucher cuộn ngang kiểu Shopee — chỉ chọn từ mã shop đang phát hành */
function CheckoutCouponStrip({
  coupons,
  appliedCode,
  loadingList,
  applying,
  error,
  subtotal,
  onSelect,
  onRemove,
}: {
  coupons: CouponItem[];
  appliedCode: string;
  loadingList: boolean;
  applying: boolean;
  error: string;
  subtotal: number;
  onSelect: (code: string) => void;
  onRemove: () => void;
}) {
  const SHOPEE_ORANGE = "#EE4D2D";
  const SHOPEE_ORANGE_SOFT = "#FFF4F0";

  if (loadingList) {
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color={SHOPEE_ORANGE} />
        <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>
          Đang tải ưu đãi...
        </Text>
      </View>
    );
  }

  if (coupons.length === 0) {
    return (
      <View
        style={{
          paddingVertical: 18,
          paddingHorizontal: 12,
          alignItems: "center",
          backgroundColor: SHOPEE_ORANGE_SOFT,
          borderRadius: 12,
        }}
      >
        <AppIcon name="tag" size={22} color="#F97316" />
        <Text
          style={{
            fontSize: 13,
            color: "#78716C",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Hiện chưa có mã giảm giá khả dụng. Quay lại sau bạn nhé!
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 2, paddingRight: 8 }}
      >
        {coupons.map((c) => {
          const isApplied = appliedCode === c.code;
          const discountHeadline =
            c.type === "PERCENT"
              ? `Giảm ${c.value}%`
              : `Giảm ${c.value.toLocaleString("vi-VN")}₫`;
          const minOk = c.minOrder == null || subtotal >= c.minOrder;
          const disabled = applying || (!isApplied && !minOk);

          return (
            <Pressable
              key={c.id}
              onPress={() => {
                if (isApplied) onRemove();
                else if (minOk) onSelect(c.code);
              }}
              disabled={disabled && !isApplied}
              style={({ pressed }) => ({
                width: 232,
                borderRadius: 10,
                overflow: "hidden",
                opacity: disabled && !isApplied ? 0.5 : pressed ? 0.92 : 1,
                borderWidth: isApplied ? 2 : 0,
                borderColor: isApplied ? "#059669" : "transparent",
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  minHeight: 108,
                  backgroundColor: isApplied ? SHOPEE_ORANGE_SOFT : SHOPEE_ORANGE,
                }}
              >
                {/* Cạnh “vé” có khấc */}
                <View
                  style={{
                    width: 36,
                    backgroundColor: isApplied ? "#FFEDD5" : "rgba(0,0,0,0.12)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderRightColor: isApplied ? "#FDBA74" : "rgba(255,255,255,0.35)",
                  }}
                >
                  <AppIcon
                    name="percent"
                    size={20}
                    color={isApplied ? SHOPEE_ORANGE : "#fff"}
                  />
                </View>
                <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: isApplied ? SHOPEE_ORANGE : "#fff",
                      letterSpacing: -0.3,
                    }}
                    numberOfLines={1}
                  >
                    {discountHeadline}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: isApplied ? "#44403C" : "rgba(255,255,255,0.95)",
                      marginTop: 4,
                    }}
                    numberOfLines={1}
                  >
                    {c.code}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: isApplied ? "#78716C" : "rgba(255,255,255,0.85)",
                      marginTop: 4,
                    }}
                    numberOfLines={2}
                  >
                    {c.minOrder
                      ? `Đơn từ ${c.minOrder.toLocaleString("vi-VN")}₫`
                      : "Không giới hạn đơn tối thiểu"}
                    {!minOk
                      ? ` · Còn thiếu ${(c.minOrder! - subtotal).toLocaleString("vi-VN")}₫`
                      : ""}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    {isApplied ? (
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#059669" }}>
                        Đang áp dụng · Chạm để bỏ
                      </Text>
                    ) : (
                      <View
                        style={{
                          backgroundColor: "#fff",
                          paddingHorizontal: 12,
                          paddingVertical: 5,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: SHOPEE_ORANGE,
                          }}
                        >
                          {minOk ? "Lấy mã" : "Chưa đủ điều kiện"}
                        </Text>
                      </View>
                    )}
                    {applying && !isApplied ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            backgroundColor: "#FEF2F2",
            borderRadius: 10,
            padding: 10,
            marginTop: 12,
          }}
        >
          <AppIcon name="alert-circle" size={14} color="#DC2626" />
          <Text style={{ fontSize: 12, color: "#DC2626", flex: 1 }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────

export default function CheckoutScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const serverCart = useCartStore((s) => s.serverCart);
  const clearServerCart = useCartStore((s) => s.clearServerCart);
  const clearGuestCart = useCartStore((s) => s.clearGuestCart);

  const checkoutParams = useLocalSearchParams();
  const isBuyNow = routeParam(checkoutParams.buyNow) === "1";
  const buyNowProductId = Number(routeParam(checkoutParams.productId));
  const buyNowQty = Math.max(
    1,
    parseInt(routeParam(checkoutParams.quantity), 10) || 1,
  );
  const buyNowUnitPrice = Number(routeParam(checkoutParams.unitPrice));

  const routeVariantIdParsed = (() => {
    const v = Number(routeParam(checkoutParams.variantId));
    return Number.isFinite(v) && v > 0 ? v : null;
  })();

  const [buyNowVariantId, setBuyNowVariantId] = useState<number | null>(
    routeVariantIdParsed,
  );
  const [buyNowVariantLoading, setBuyNowVariantLoading] = useState(
    () =>
      isBuyNow &&
      routeVariantIdParsed == null &&
      Number.isFinite(buyNowProductId) &&
      buyNowProductId > 0,
  );

  // Auth guard
  const redirectedRef = useRef(false);
  useEffect(() => {
    if (!user && !redirectedRef.current) {
      redirectedRef.current = true;
      navLockRun(() => router.replace("/auth/login" as any));
    }
  }, [user, router]);

  // ── Address ──
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [allAddresses, setAllAddresses] = useState<AddressResponse[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  // ── Coupons ──
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // ── Shipping ──
  const [shippingId, setShippingId] = useState("free");
  const shippingFee =
    SHIPPING_OPTIONS.find((s) => s.id === shippingId)?.fee ?? 0;

  // ── Payment ──
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("COD");
  const [note, setNote] = useState("");

  // ── Order placing ──
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  /** Giống web: modal QR + link, không mở WebBrowser làm bước chính */
  const [payosSheet, setPayosSheet] = useState<null | {
    orderId: number;
    orderCode: string;
    checkoutUrl: string | null;
    qrUrl: string | null;
    expiresAt: string | null;
    grandTotal: number;
  }>(null);

  /** Mua ngay: resolve variantId nếu màn SP không gửi (SP không biến thể trên UI). */
  useEffect(() => {
    const v = Number(routeParam(checkoutParams.variantId));
    if (Number.isFinite(v) && v > 0) {
      setBuyNowVariantId(v);
      setBuyNowVariantLoading(false);
      return;
    }
    if (!isBuyNow || !Number.isFinite(buyNowProductId) || buyNowProductId <= 0) {
      if (!isBuyNow) setBuyNowVariantId(null);
      setBuyNowVariantLoading(false);
      return;
    }
    let cancelled = false;
    setBuyNowVariantLoading(true);
    setBuyNowVariantId(null);
    (async () => {
      try {
        const p = await getProductDetail(buyNowProductId);
        if (cancelled) return;
        const mapped = mapProductColorsFromApi(p);
        let found: number | null = null;
        for (const c of mapped) {
          const s = c.sizes?.find((x) => x.variantId > 0);
          if (s) {
            found = s.variantId;
            break;
          }
        }
        if (!cancelled) {
          setBuyNowVariantId(found);
          if (!found) {
            Alert.alert(
              "Không thể mua ngay",
              "Sản phẩm chưa có phiên bản hợp lệ để đặt hàng.",
            );
          }
        }
      } catch {
        if (!cancelled) {
          setBuyNowVariantId(null);
          Alert.alert("Lỗi", "Không tải được thông tin sản phẩm.");
        }
      } finally {
        if (!cancelled) setBuyNowVariantLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isBuyNow, buyNowProductId, checkoutParams.variantId]);

  const buyNowLine: CartItem | null = useMemo(() => {
    if (
      !isBuyNow ||
      !Number.isFinite(buyNowProductId) ||
      buyNowProductId <= 0 ||
      buyNowVariantId == null ||
      buyNowVariantId <= 0 ||
      !Number.isFinite(buyNowUnitPrice)
    ) {
      return null;
    }
    return {
      id: -1,
      productId: buyNowProductId,
      productName:
        routeParam(checkoutParams.productName) ||
        `Sản phẩm #${buyNowProductId}`,
      variantId: buyNowVariantId,
      color: routeParam(checkoutParams.color) || null,
      size: routeParam(checkoutParams.size) || null,
      imgSrc: routeParam(checkoutParams.imgSrc),
      quantity: buyNowQty,
      price: buyNowUnitPrice,
      maxQuantity: 999_999,
    };
  }, [
    isBuyNow,
    buyNowProductId,
    buyNowVariantId,
    buyNowUnitPrice,
    buyNowQty,
    checkoutParams.productName,
    checkoutParams.color,
    checkoutParams.size,
    checkoutParams.imgSrc,
  ]);

  const cartItems: CartItem[] = useMemo(() => {
    if (isBuyNow && buyNowLine) return [buyNowLine];
    return serverCart?.items ?? [];
  }, [isBuyNow, buyNowLine, serverCart?.items]);

  const subtotal = useMemo(() => {
    if (isBuyNow && buyNowLine) return buyNowLine.price * buyNowLine.quantity;
    return serverCart?.totalPrice ?? 0;
  }, [isBuyNow, buyNowLine, serverCart?.totalPrice]);

  const taxFee = subtotal > 0 ? 10000 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + taxFee);

  // ── Load address + coupons ──
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoadingAddress(true);
        const [defRes, allRes] = await Promise.all([
          addressApi.getDefault(token),
          addressApi.getMyAddresses(token),
        ]);
        setAddress(defRes);
        setAllAddresses(allRes);
      } catch {
        /* no default address */
      } finally {
        setLoadingAddress(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoadingCoupons(true);
        const res = await couponApi.getActiveCoupons(token);
        setCoupons(res ?? []);
      } catch {
        /* silent */
      } finally {
        setLoadingCoupons(false);
      }
    })();
  }, [token]);

  const handleApplyCoupon = useCallback(
    async (code: string) => {
      if (!code.trim()) return;
      if (!token) return;
      try {
        setCouponLoading(true);
        setCouponError("");
        const data = await couponApi.applyCoupon(token, {
          code: code.trim(),
          subtotal,
        });
        if (data.valid) {
          setDiscount(data.discountAmount);
          setCouponCode(code.trim());
          setCouponError("");
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
        } else {
          setCouponError(data.message || "Mã không hợp lệ.");
          setDiscount(0);
          setCouponCode("");
        }
      } catch (err: unknown) {
        setCouponError(
          getApiErrorMessage(err, "Mã giảm giá không hợp lệ."),
        );
        setDiscount(0);
        setCouponCode("");
      } finally {
        setCouponLoading(false);
      }
    },
    [token, subtotal],
  );

  const handleRemoveCoupon = useCallback(() => {
    setCouponCode("");
    setDiscount(0);
    setCouponError("");
  }, []);

  // ── Place order ──
  const handlePlaceOrder = async () => {
    setOrderError("");

    if (!user || !token) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để đặt hàng.");
      return;
    }
    if (buyNowVariantLoading || (isBuyNow && !buyNowLine)) {
      Alert.alert(
        "Thông báo",
        isBuyNow
          ? "Chưa tải xong thông tin sản phẩm mua ngay. Vui lòng chờ hoặc thử lại."
          : "Vui lòng chờ.",
      );
      return;
    }
    if (!cartItems.length) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (!address?.id) {
      Alert.alert(
        "Thiếu địa chỉ",
        "Vui lòng chọn hoặc thêm địa chỉ giao hàng.",
      );
      return;
    }
    const hasInvalidVariant = cartItems.some((item) => item.variantId == null);
    if (hasInvalidVariant) {
      Alert.alert(
        "Sản phẩm chưa đầy đủ",
        "Có sản phẩm chưa chọn phiên bản (màu/size). Vui lòng kiểm tra lại giỏ hàng.",
      );
      return;
    }

    try {
      setPlacingOrder(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const items = cartItems.map((item) => ({
        productId: Math.floor(Number(item.productId)),
        variantId: Math.floor(Number(item.variantId)),
        quantity: Math.max(1, Math.floor(Number(item.quantity))),
        unitPrice: Math.max(0, Number(item.price)),
      }));
      const badLine = items.some(
        (i) =>
          !Number.isFinite(i.productId) ||
          i.productId <= 0 ||
          !Number.isFinite(i.variantId) ||
          i.variantId <= 0 ||
          !Number.isFinite(i.quantity) ||
          !Number.isFinite(i.unitPrice),
      );
      if (badLine) {
        setOrderError(
          "Dữ liệu giỏ hàng không hợp lệ (sản phẩm, phiên bản hoặc giá). Vui lòng tải lại giỏ.",
        );
        return;
      }

      const data = await orderApi.checkout(token, {
        addressId: address.id,
        paymentMethod,
        subtotal,
        discountTotal: discount,
        taxTotal: taxFee,
        shippingFee,
        grandTotal,
        couponCode: couponCode || null,
        note: note.trim() || undefined,
        items,
      });

      const resolvedOrderId = Number(data?.orderId);
      if (!Number.isFinite(resolvedOrderId) || resolvedOrderId <= 0) {
        setOrderError(
          "Phản hồi đặt hàng không hợp lệ từ máy chủ. Vui lòng kiểm tra đơn hàng trong mục Đơn của tôi.",
        );
        return;
      }

      /** Mua ngay không đụng giỏ — chỉ xóa store giỏ khi đặt từ giỏ thường. */
      if (!isBuyNow) {
        clearServerCart();
        clearGuestCart();
      }

      if (paymentMethod === "COD") {
        void refreshOrderAttentionBadges(token);
        router.replace({
          pathname: "/order-success",
          params: {
            orderId: String(resolvedOrderId),
            orderCode: data.orderCode,
            paymentMethod: "COD",
            grandTotal: String(grandTotal),
          },
        } as any);
        return;
      }

      // PAYOS: hiển thị QR + link trong sheet (cùng hướng FE_UTE_SHOP_V2)
      if (!data.payosCheckoutUrl && !data.payosQrUrl) {
        setOrderError("Không tạo được link thanh toán PayOS. Vui lòng thử lại.");
        setPlacingOrder(false);
        return;
      }

      await savePendingPayOS({
        from: "checkout",
        orderId: resolvedOrderId,
        checkoutUrl: data.payosCheckoutUrl ?? null,
        qrUrl: data.payosQrUrl ?? null,
        expiresAt: data.paymentExpiresAt ?? null,
      });

      setPayosSheet({
        orderId: resolvedOrderId,
        orderCode: data.orderCode,
        checkoutUrl: data.payosCheckoutUrl ?? null,
        qrUrl: data.payosQrUrl ?? null,
        expiresAt: data.paymentExpiresAt ?? null,
        grandTotal,
      });
      void refreshOrderAttentionBadges(token);
    } catch (err: unknown) {
      setOrderError(
        getApiErrorMessage(err, "Có lỗi khi đặt hàng. Vui lòng thử lại."),
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceMuted }}>
      {/* ── Header ── */}
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
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{ fontSize: 20, fontWeight: "700", color: colors.text }}
          >
            {isBuyNow ? "Mua ngay" : "Đặt hàng"}
          </Text>
          {((isBuyNow && buyNowLine) || (!isBuyNow && cartItems.length > 0)) && (
            <Text
              style={{ fontSize: 12, color: colors.mutedText, marginTop: 1 }}
            >
              {isBuyNow ? "1 sản phẩm" : `${cartItems.length} sản phẩm`}
            </Text>
          )}
        </View>
      </View>

      {/* ── Body ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 32 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 1. Địa chỉ giao hàng ── */}
          <SectionCard
            title="Địa chỉ giao hàng"
            rightSlot={
              <Pressable
                onPress={() => setShowAddressPicker(true)}
                className="active:opacity-70"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: colors.tint }}
                >
                  Đổi
                </Text>
                <AppIcon name="chevron-right" size={14} color={colors.tint} />
              </Pressable>
            }
          >
            {loadingAddress ? (
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                <ActivityIndicator size="small" color={colors.tint} />
              </View>
            ) : address ? (
              <Pressable
                onPress={() => setShowAddressPicker(true)}
                className="active:opacity-80"
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: `${colors.tint}15`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppIcon name="map-pin" size={18} color={colors.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {address.firstName} {address.lastName}
                      </Text>
                      <Text
                        style={{ fontSize: 13, color: colors.mutedText }}
                      >
                        {address.phone}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.text,
                        marginTop: 3,
                        lineHeight: 18,
                      }}
                    >
                      {address.address1}, {address.city}
                      {address.province ? `, ${address.province}` : ""} —{" "}
                      {address.region}
                    </Text>
                    {address.company ? (
                      <Text
                        style={{ fontSize: 12, color: colors.mutedText, marginTop: 2 }}
                      >
                        {address.company}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={() =>
                  navLockRun(() => router.push("/addresses" as any))
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderStyle: "dashed",
                  borderColor: "#F59E0B",
                  backgroundColor: "#FFFBEB",
                }}
                className="active:opacity-80"
              >
                <AppIcon name="map-pin" size={18} color="#F59E0B" />
                <Text
                  style={{ fontSize: 13, color: "#92400E", fontWeight: "600" }}
                >
                  Thêm địa chỉ giao hàng
                </Text>
              </Pressable>
            )}
          </SectionCard>

          {/* ── 2. Sản phẩm ── */}
          <SectionCard title={`Sản phẩm (${isBuyNow ? 1 : cartItems.length})`}>
            {buyNowVariantLoading ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator size="small" color={colors.tint} />
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.mutedText,
                    marginTop: 10,
                  }}
                >
                  Đang tải sản phẩm...
                </Text>
              </View>
            ) : cartItems.length === 0 ? (
              <Text
                style={{
                  fontSize: 13,
                  color: colors.mutedText,
                  textAlign: "center",
                  paddingVertical: 8,
                }}
              >
                Giỏ hàng trống
              </Text>
            ) : (
              <View style={{ gap: 12 }}>
                {cartItems.map((item, idx) => {
                  const thumb = item.imgSrc
                    ? (resolveAssetUrl(item.imgSrc) ?? item.imgSrc)
                    : null;
                  const isLast = idx === cartItems.length - 1;
                  return (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: "row",
                        gap: 12,
                        paddingBottom: isLast ? 0 : 12,
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      {thumb ? (
                        <Image
                          source={{ uri: thumb }}
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 10,
                            backgroundColor: colors.surfaceMuted,
                          }}
                          contentFit="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 10,
                            backgroundColor: colors.surfaceMuted,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AppIcon
                            name="image"
                            size={24}
                            color={colors.mutedText}
                          />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: colors.text,
                            lineHeight: 18,
                          }}
                          numberOfLines={2}
                        >
                          {item.productName}
                        </Text>
                        {(item.color || item.size) && (
                          <Text
                            style={{
                              fontSize: 11,
                              color: colors.mutedText,
                              marginTop: 2,
                            }}
                          >
                            {[item.color, item.size].filter(Boolean).join(" / ")}
                          </Text>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 6,
                          }}
                        >
                          <Text
                            style={{ fontSize: 12, color: colors.mutedText }}
                          >
                            x{item.quantity}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "700",
                              color: colors.text,
                            }}
                          >
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}
                            ₫
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </SectionCard>

          {/* ── 3. Vận chuyển ── */}
          <SectionCard title="Phương thức vận chuyển">
            <View style={{ gap: 10 }}>
              {SHIPPING_OPTIONS.map((opt) => {
                const isActive = shippingId === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setShippingId(opt.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      padding: 13,
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: isActive ? colors.tint : colors.border,
                      backgroundColor: isActive
                        ? `${colors.tint}08`
                        : colors.background,
                    }}
                    className="active:opacity-80"
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isActive ? colors.tint : colors.border,
                        backgroundColor: isActive ? colors.tint : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isActive && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#fff",
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={{ fontSize: 11, color: colors.mutedText, marginTop: 1 }}
                      >
                        {opt.description}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: opt.fee === 0 ? "#059669" : colors.text,
                      }}
                    >
                      {opt.fee === 0 ? "Miễn phí" : `${opt.fee.toLocaleString("vi-VN")}₫`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SectionCard>

          {/* ── 4. Mã giảm giá (chọn voucher — kiểu Shopee) ── */}
          <SectionCard
            title="Shop khuyến mãi"
            rightSlot={
              coupons.length > 0 ? (
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#EE4D2D" }}>
                  {coupons.length} mã
                </Text>
              ) : null
            }
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.mutedText,
                marginBottom: 12,
                lineHeight: 18,
              }}
            >
              Vuốt ngang để xem mã. Chạm &quot;Lấy mã&quot; để áp dụng — chạm lại mã đang dùng để
              bỏ.
            </Text>
            <CheckoutCouponStrip
              coupons={coupons}
              appliedCode={couponCode}
              loadingList={loadingCoupons}
              applying={couponLoading}
              error={couponError}
              subtotal={subtotal}
              onSelect={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
            />
          </SectionCard>

          {/* ── 5. Ghi chú ── */}
          <SectionCard title="Ghi chú cho đơn hàng">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ghi chú cho người giao hàng (tùy chọn)..."
              placeholderTextColor={colors.mutedText}
              multiline
              numberOfLines={3}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surfaceMuted,
                padding: 12,
                fontSize: 13,
                color: colors.text,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
          </SectionCard>

          {/* ── 6. Phương thức thanh toán ── */}
          <SectionCard title="Phương thức thanh toán">
            <View style={{ gap: 10 }}>
              {PAYMENT_METHODS.map((pm) => {
                const isActive = paymentMethod === pm.id;
                return (
                  <Pressable
                    key={pm.id}
                    onPress={() => setPaymentMethod(pm.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      padding: 14,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: isActive ? colors.tint : colors.border,
                      backgroundColor: isActive
                        ? `${colors.tint}08`
                        : colors.background,
                    }}
                    className="active:opacity-80"
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: isActive
                          ? `${colors.tint}20`
                          : colors.surfaceMuted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppIcon
                        name={pm.iconName as any}
                        size={20}
                        color={isActive ? colors.tint : colors.mutedText}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {pm.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.mutedText,
                          marginTop: 1,
                        }}
                      >
                        {pm.desc}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: isActive ? colors.tint : colors.border,
                        backgroundColor: isActive
                          ? colors.tint
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isActive && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#fff",
                          }}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </SectionCard>

          {/* ── 7. Tóm tắt thanh toán ── */}
          <SectionCard title="Tóm tắt thanh toán">
            <SummaryRow
              label="Tạm tính"
              value={`${subtotal.toLocaleString("vi-VN")}₫`}
            />
            <SummaryRow
              label="Phí vận chuyển"
              value={
                shippingFee === 0
                  ? "Miễn phí"
                  : `${shippingFee.toLocaleString("vi-VN")}₫`
              }
              accent={shippingFee === 0}
            />
            {discount > 0 && (
              <SummaryRow
                label="Giảm giá"
                value={`-${discount.toLocaleString("vi-VN")}₫`}
                accent
              />
            )}
            <SummaryRow
              label="Thuế"
              value={`${taxFee.toLocaleString("vi-VN")}₫`}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 12,
                marginTop: 4,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>
                Tổng cộng
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "800", color: colors.tint }}
              >
                {grandTotal.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </SectionCard>

          {/* Error message */}
          {orderError ? (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                padding: 13,
                marginBottom: 4,
              }}
            >
              <AppIcon name="alert-circle" size={16} color="#DC2626" />
              <Text style={{ flex: 1, fontSize: 13, color: "#DC2626" }}>
                {orderError}
              </Text>
            </View>
          ) : null}

          {/* Security note */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 4,
              marginBottom: 12,
            }}
          >
            <AppIcon name="shield" size={14} color={colors.mutedText} />
            <Text style={{ fontSize: 11, color: colors.mutedText, flex: 1 }}>
              Tất cả giao dịch được bảo mật và mã hóa.
            </Text>
          </View>

          {/* Place order button */}
          <CustomButton
            title={placingOrder ? "Đang xử lý..." : `Đặt hàng · ${grandTotal.toLocaleString("vi-VN")}₫`}
            onPress={handlePlaceOrder}
            disabled={
              placingOrder ||
              buyNowVariantLoading ||
              (isBuyNow && !buyNowLine) ||
              !cartItems.length ||
              !address ||
              grandTotal <= 0
            }
            style={{ borderRadius: 16, paddingVertical: 16 }}
            titleStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Address picker ── */}
      <AddressPickerSheet
        visible={showAddressPicker}
        addresses={allAddresses}
        selected={address}
        onSelect={setAddress}
        onClose={() => setShowAddressPicker(false)}
        onAddNew={() => {
          setShowAddressPicker(false);
          navLockRun(() => router.push("/addresses" as any));
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
          if (!payosSheet) return;
          const id = payosSheet.orderId;
          setPayosSheet(null);
          router.replace({
            pathname: "/order/[id]",
            params: { id: String(id) },
          } as any);
        }}
        onPaidSuccess={() => {
          if (!payosSheet || !token) return;
          const { orderId, orderCode, grandTotal: gt } = payosSheet;
          void clearPendingPayOS();
          setPayosSheet(null);
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
