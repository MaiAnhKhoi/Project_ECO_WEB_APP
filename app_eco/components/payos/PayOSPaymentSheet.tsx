import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import type { PayOSStatusResponse } from "@/types/order";

export type PayOSPaymentSheetProps = {
  visible: boolean;
  orderId: number;
  /** Hiển thị rõ đang thanh toán cho đơn nào */
  orderCode?: string | null;
  checkoutUrl: string | null;
  qrContent: string | null;
  expiresAt: string | null;
  onClose: () => void;
  /** Gọi khi PayOS đã ghi nhận thanh toán */
  onPaidSuccess: () => void;
  checkPayOSStatus: (orderId: number) => Promise<PayOSStatusResponse>;
};

export function PayOSPaymentSheet({
  visible,
  orderId,
  orderCode,
  checkoutUrl,
  qrContent,
  expiresAt,
  onClose,
  onPaidSuccess,
  checkPayOSStatus,
}: PayOSPaymentSheetProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const [remainingSec, setRemainingSec] = useState(0);
  const [checkMessage, setCheckMessage] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!visible || !expiresAt) {
      setRemainingSec(0);
      return;
    }
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setRemainingSec(Math.max(0, Math.floor(diff / 1000)));
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [visible, expiresAt]);

  const formatRemain = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const expired = Boolean(expiresAt) && remainingSec <= 0;

  const handleCheckPayment = useCallback(
    async (showMessage: boolean) => {
      if (!orderId) return;
      try {
        setChecking(true);
        if (showMessage) setCheckMessage("");
        const res = await checkPayOSStatus(orderId);
        const ps = (res.paymentStatus || "").toLowerCase();
        if (ps === "paid") {
          setCheckMessage("Thanh toán thành công!");
          onPaidSuccess();
          return;
        }
        if (ps === "expired") {
          setCheckMessage("Đơn hàng đã hết hạn thanh toán.");
          return;
        }
        if (showMessage) {
          setCheckMessage("Hệ thống chưa ghi nhận thanh toán, vui lòng thử lại.");
        }
      } catch {
        if (showMessage) {
          setCheckMessage("Không thể kiểm tra trạng thái thanh toán.");
        }
      } finally {
        setChecking(false);
      }
    },
    [orderId, checkPayOSStatus, onPaidSuccess],
  );

  useEffect(() => {
    if (!visible || !orderId || expired) return;
    const interval = setInterval(() => {
      void handleCheckPayment(false);
    }, 10_000);
    return () => clearInterval(interval);
  }, [visible, orderId, expired, handleCheckPayment]);

  const openCheckoutPage = useCallback(async () => {
    if (!checkoutUrl?.trim()) return;
    const url = checkoutUrl.trim();
    try {
      await WebBrowser.openBrowserAsync(url, {
        dismissButtonStyle: "close",
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        toolbarColor: colors.background,
      });
    } catch {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
        else {
          setCheckMessage(
            "Không thể mở trang PayOS trên thiết bị. Vui lòng quét mã QR bằng app ngân hàng.",
          );
        }
      } catch {
        setCheckMessage(
          "Không thể mở trang thanh toán. Vui lòng quét mã QR hoặc thử lại sau.",
        );
      }
    }
  }, [checkoutUrl, colors.background]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom + 16,
            maxHeight: "88%",
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
              Thanh toán chuyển khoản
            </Text>
            {orderCode?.trim() ? (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.tint,
                  marginTop: 4,
                }}
              >
                Mã đơn: {orderCode.trim()}
              </Text>
            ) : null}
          </View>

          <ScrollView
            style={{ maxHeight: 520 }}
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {expired ? (
              <Text style={{ color: "#b45309", fontSize: 14 }}>
                Đã hết hạn thanh toán. Vui lòng tạo đơn mới hoặc xem chi tiết đơn.
              </Text>
            ) : (
              <>
                <Text style={{ fontSize: 13, color: colors.mutedText, marginBottom: 8 }}>
                  Thời gian còn lại
                </Text>
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: colors.text,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: colors.background, fontWeight: "700", fontSize: 16 }}>
                      {expiresAt ? formatRemain(remainingSec) : "—"}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  {qrContent ? (
                    <View
                      style={{
                        padding: 12,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                      }}
                    >
                      <QRCode value={qrContent} size={210} />
                    </View>
                  ) : (
                    <Text style={{ color: colors.mutedText }}>Không có mã QR</Text>
                  )}
                </View>

                {checkoutUrl ? (
                  <CustomButton
                    title="Mở trang thanh toán"
                    onPress={() => void openCheckoutPage()}
                  />
                ) : null}

                <Text
                  style={{
                    fontSize: 12,
                    color: colors.mutedText,
                    marginTop: 14,
                    textAlign: "center",
                  }}
                >
                  Sau khi chuyển khoản, bấm &quot;Tôi đã thanh toán xong&quot;.
                </Text>
              </>
            )}

            {checkMessage ? (
              <Text
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  color: colors.text,
                  backgroundColor: colors.surfaceMuted,
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                {checkMessage}
              </Text>
            ) : null}
          </ScrollView>

          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {!expired ? (
              <Pressable
                onPress={() => void handleCheckPayment(true)}
                disabled={checking}
                style={{
                  backgroundColor: colors.text,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: checking ? 0.6 : 1,
                }}
              >
                {checking ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={{ color: colors.background, fontWeight: "700" }}>
                    Tôi đã thanh toán xong
                  </Text>
                )}
              </Pressable>
            ) : null}
            <CustomButton title="Đóng / Xem đơn hàng" variant="secondary" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
