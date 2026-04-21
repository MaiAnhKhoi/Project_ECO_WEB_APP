import React, { useEffect, useState } from "react";
import {
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

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { orderApi } from "@/services/orderApi";
import { useAuthStore } from "@/store/authStore";
import {
  canCancelOrder,
  needsRefundInfo,
  type CancelOrderRequest,
  type OrderSummary,
} from "@/types/order";

const CANCEL_REASONS = [
  "Tôi đổi ý",
  "Đặt nhầm sản phẩm",
  "Tìm được giá tốt hơn",
  "Muốn thay đổi địa chỉ giao hàng",
  "Khác",
];

type Props = {
  order: OrderSummary | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function OrderCancelSheet({ order, onClose, onSuccess }: Props) {
  const colors = useAppColors();
  const token = useAuthStore((s) => s.accessToken);
  const needBank =
    order != null &&
    (needsRefundInfo(order) ||
      (order.paymentStatus === "paid" &&
        (order.status === "pending" || order.status === "processing")));

  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setReason(CANCEL_REASONS[0]);
      setCustomReason("");
      setBankName("");
      setAccountNumber("");
      setAccountHolder("");
    }
  }, [order]);

  if (!order) return null;

  const finalReason =
    reason === "Khác" ? customReason.trim() || "Khác" : reason;

  const handleSubmit = async () => {
    if (needBank) {
      if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin ngân hàng để hoàn tiền.");
        return;
      }
    }

    const payload: CancelOrderRequest = {
      reason: finalReason,
      bankName: needBank ? bankName.trim() : null,
      accountNumber: needBank ? accountNumber.trim() : null,
      accountHolder: needBank ? accountHolder.trim() : null,
    };

    setSubmitting(true);
    try {
      await orderApi.cancelOrder(token!, order.orderId, payload);
      onClose();
      onSuccess();
      Alert.alert("Thành công", "Yêu cầu hủy đơn đã được gửi.");
    } catch (e: any) {
      Alert.alert(
        "Lỗi",
        e?.message || "Không thể hủy đơn hàng. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={order != null}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={onClose}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={(e) => e.stopPropagation()}
        >
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "flex-end" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "85%",
              }}
            >
              {/* Handle */}
              <View className="mb-2 items-center pt-3">
                <View
                  className="h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: colors.border }}
                />
              </View>

              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingBottom: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: colors.text,
                    }}
                  >
                    {needsRefundInfo(order) ? "Thông tin hoàn tiền" : "Hủy đơn hàng"}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedText, marginTop: 2 }}>
                    {order.orderCode}
                  </Text>
                </View>
                <Pressable onPress={onClose} hitSlop={10}>
                  <AppIcon name="x" size={22} color={colors.mutedText} />
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
              >
                {/* Cảnh báo */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    backgroundColor: "#FEF3C7",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 20,
                  }}
                >
                  <AppIcon name="alert-triangle" size={16} color="#D97706" style={{ marginTop: 1 }} />
                  <Text style={{ flex: 1, fontSize: 13, color: "#92400E" }}>
                    {needsRefundInfo(order)
                      ? "Đơn hàng đã bị hủy. Vui lòng cung cấp thông tin ngân hàng để nhận hoàn tiền."
                      : "Sau khi hủy, đơn hàng không thể khôi phục lại."}
                  </Text>
                </View>

                {/* Lý do hủy (ẩn khi admin đã hủy) */}
                {!needsRefundInfo(order) ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.text,
                        marginBottom: 10,
                      }}
                    >
                      Lý do hủy đơn
                    </Text>
                    {CANCEL_REASONS.map((r) => (
                      <Pressable
                        key={r}
                        onPress={() => setReason(r)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: reason === r ? colors.tint : colors.border,
                            backgroundColor: reason === r ? colors.tint : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {reason === r ? (
                            <View
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#fff",
                              }}
                            />
                          ) : null}
                        </View>
                        <Text style={{ fontSize: 14, color: colors.text }}>{r}</Text>
                      </Pressable>
                    ))}
                    {reason === "Khác" ? (
                      <TextInput
                        value={customReason}
                        onChangeText={setCustomReason}
                        placeholder="Nhập lý do cụ thể..."
                        placeholderTextColor={colors.mutedText}
                        multiline
                        numberOfLines={3}
                        style={{
                          marginTop: 8,
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 12,
                          padding: 12,
                          color: colors.text,
                          fontSize: 14,
                          textAlignVertical: "top",
                          minHeight: 80,
                          backgroundColor: colors.surfaceMuted,
                        }}
                      />
                    ) : null}
                  </View>
                ) : null}

                {/* Thông tin ngân hàng */}
                {needBank ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.text,
                        marginBottom: 12,
                      }}
                    >
                      Thông tin ngân hàng để hoàn tiền
                    </Text>
                    {[
                      {
                        label: "Tên ngân hàng",
                        value: bankName,
                        onChange: setBankName,
                        placeholder: "Ví dụ: MB, Vietcombank…",
                      },
                      {
                        label: "Số tài khoản",
                        value: accountNumber,
                        onChange: setAccountNumber,
                        placeholder: "Nhập số tài khoản",
                      },
                      {
                        label: "Chủ tài khoản",
                        value: accountHolder,
                        onChange: setAccountHolder,
                        placeholder: "Nhập tên chủ tài khoản",
                      },
                    ].map((field) => (
                      <View key={field.label} style={{ marginBottom: 12 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: colors.mutedText,
                            marginBottom: 6,
                          }}
                        >
                          {field.label}
                        </Text>
                        <TextInput
                          value={field.value}
                          onChangeText={field.onChange}
                          placeholder={field.placeholder}
                          placeholderTextColor={colors.mutedText}
                          style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            color: colors.text,
                            fontSize: 14,
                            backgroundColor: colors.surfaceMuted,
                          }}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Submit */}
                <View style={{ gap: 10 }}>
                  <CustomButton
                    title={submitting ? "Đang gửi..." : (needsRefundInfo(order) ? "Xác nhận" : "Xác nhận hủy")}
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{ backgroundColor: "#DC2626" }}
                  />
                  <CustomButton
                    title="Đóng"
                    variant="secondary"
                    onPress={onClose}
                    disabled={submitting}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
