import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { OutfitCard } from "@/components/ai/OutfitCard";
import { useAppColors } from "@/hooks/use-app-colors";
import { useOutfitGenerator } from "@/hooks/useOutfitGenerator";
import type { Outfit } from "@/types/ai";
import { navLockRun } from "@/utils/navLock";

/** Gợi ý prompt nhanh — giống web quick suggestion chips */
const PROMPT_CHIPS = [
  "Outfit đi biển mùa hè",
  "Trang phục dự tiệc thanh lịch",
  "Set đồ công sở nam",
  "Casual weekend outfit",
] as const;

export default function AIStylistScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [prompt, setPrompt] = useState("");

  const generator = useOutfitGenerator();

  const outfits: Outfit[] = generator.data?.outfits ?? [];
  const isLoading = generator.isPending;
  const error = generator.error
    ? (generator.error as any)?.message || "Không thể tạo outfit"
    : null;

  const handleGenerate = () => {
    const text = prompt.trim();
    if (!text) return;
    generator.mutate({ prompt: text });
  };

  const handleAddToCart = (outfit: Outfit) => {
    // Hiển thị danh sách sản phẩm — trong web dùng dispatch addProductToCart cho từng item
    Alert.alert(
      "Thêm vào giỏ hàng",
      `Thêm ${outfit.items.length} sản phẩm từ "${outfit.name}" vào giỏ?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Thêm",
          onPress: () => {
            // TODO: dispatch addProductToCart tương tự web
            // outfit.items.forEach(item => useCartStore.getState().addItem(item.productId))
            Alert.alert("Đã thêm", "Sản phẩm đã được thêm vào giỏ hàng.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header — breadcrumb + back (giống web: Trang chủ > AI Stylist) */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.divider, backgroundColor: colors.background },
        ]}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>

        <View style={styles.headerCenter}>
          <Text style={[styles.breadcrumb, { color: colors.mutedText }]}>
            Trang chủ
          </Text>
          <AppIcon name="chevron-right" size={12} color={colors.mutedText} />
          <Text style={[styles.breadcrumbActive, { color: colors.text }]}>
            AI Stylist
          </Text>
        </View>

        <CustomIconButton
          onPress={() => navLockRun(() => router.push("/(tabs)" as any))}
          accessibilityLabel="Về trang chủ"
        >
          <AppIcon name="home" size={20} color={colors.mutedText} />
        </CustomIconButton>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section — giống web prompt box */}
          <View style={[styles.heroSection, { backgroundColor: colors.background }]}>
            <View
              style={[styles.heroBadge, { backgroundColor: colors.tint }]}
            >
              <AppIcon name="zap" size={14} color="#fff" />
              <Text style={styles.heroBadgeText}>AI Stylist</Text>
            </View>

            <Text style={[styles.heroTitle, { color: colors.text }]}>
              Tạo outfit theo phong cách của bạn
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedText }]}>
              Nhập mô tả và AI sẽ gợi ý 3 bộ outfit từ sản phẩm có trong shop
            </Text>

            {/* Prompt input lớn — giống ChatGPT-style trên web */}
            <CustomInput
              placeholder="Ví dụ: Outfit đi biển mùa hè, năng động, màu sáng..."
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
              style={styles.promptInput as any}
            />

            {/* Prompt chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {PROMPT_CHIPS.map((chip) => (
                <Pressable
                  key={chip}
                  onPress={() => setPrompt(chip)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.surfaceMuted,
                      borderColor: colors.border,
                    },
                  ]}
                  className="active:opacity-70"
                >
                  <Text style={[styles.chipText, { color: colors.text }]}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Nút Tạo outfit — giống web "Tạo outfit" prominent button */}
            <CustomButton
              title="Tạo outfit"
              onPress={handleGenerate}
              loading={isLoading}
              disabled={!prompt.trim() || isLoading}
              leftIcon={
                !isLoading ? (
                  <AppIcon name="zap" size={16} color="#fff" />
                ) : undefined
              }
              style={styles.generateBtn as any}
            />
          </View>

          {/* Loading skeletons — giống web OutfitSkeletonGrid */}
          {isLoading ? (
            <View style={styles.section}>
              <LoadingSpinner
                visible
                fullscreen={false}
                message="AI đang thiết kế outfit cho bạn…"
              />
              {[1, 2, 3].map((k) => (
                <View
                  key={k}
                  style={[
                    styles.skeleton,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                />
              ))}
            </View>
          ) : null}

          {/* Error state */}
          {error && !isLoading ? (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
              <CustomButton
                title="Thử lại"
                onPress={handleGenerate}
                style={styles.retryBtn as any}
              />
            </View>
          ) : null}

          {/* Kết quả — 3 OutfitCard (giống web) */}
          {outfits.length > 0 && !isLoading ? (
            <View style={styles.section}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>
                {outfits.length} outfit gợi ý dành cho bạn
              </Text>
              {outfits.map((outfit, idx) => (
                <OutfitCard
                  key={outfit.outfitNumber}
                  outfit={outfit}
                  index={idx + 1}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breadcrumb: {
    fontSize: 13,
  },
  breadcrumbActive: {
    fontSize: 13,
    fontWeight: "600",
  },
  heroSection: {
    padding: 20,
    paddingBottom: 8,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  promptInput: {
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  generateBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  skeleton: {
    height: 240,
    borderRadius: 16,
    marginBottom: 12,
  },
  errorBox: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});
