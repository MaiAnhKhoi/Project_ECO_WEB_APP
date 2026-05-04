import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AIQuickActionTriplet } from "@/components/ai/AIQuickActionTriplet";
import { AIRecommendSection } from "@/components/ai/AIRecommendSection";
import { useAppColors } from "@/hooks/use-app-colors";
import type { ProductSuggestion } from "@/types/ai";
import { navLockRun } from "@/utils/navLock";
import { useAuthStore } from "@/store/authStore";

type Props = {
  products: ProductSuggestion[];
  loading?: boolean;
};

/**
 * Khối “Khám phá cùng AI” trên Home: 3 CTA (Chat / Outfit / Phân tích phong cách) + gợi ý + lối tắt hub & lịch sử.
 */
function AIExploreHomeSectionInner({ products, loading = false }: Props) {
  const colors = useAppColors();
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);

  const goHistory = () => {
    navLockRun(() => {
      if (!token) {
        router.push({ pathname: "/auth/login", params: { next: "/ai-history" } } as any);
        return;
      }
      router.push("/ai-history" as any);
    });
  };

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.kicker, { color: colors.tint }]}>✨ Khám phá cùng AI</Text>
        </View>
        <Text style={[styles.headline, { color: colors.text }]}>
          Mua sắm thông minh & phong cách
        </Text>
        <Text style={[styles.desc, { color: colors.mutedText }]}>
          Chat tư vấn sản phẩm, tạo outfit từ hàng trong shop, hoặc phân tích phong cách từ ảnh của bạn.
        </Text>

        <View style={styles.tripletOuter}>
          <AIQuickActionTriplet />
        </View>

        <View style={[styles.subLinkRow, { borderTopColor: colors.divider }]}>
          <Pressable
            onPress={() => navLockRun(() => router.push("/ai-hub" as any))}
            accessibilityRole="button"
            accessibilityLabel="Trung tâm AI"
            style={styles.subLink}
          >
            <Text style={[styles.subLinkText, { color: colors.tint }]}>Trung tâm AI</Text>
          </Pressable>
          <Text style={{ color: colors.mutedText }}>·</Text>
          <Pressable onPress={goHistory} accessibilityRole="button" accessibilityLabel="Lịch sử AI" style={styles.subLink}>
            <Text style={[styles.subLinkText, { color: colors.tint }]}>Lịch sử AI</Text>
          </Pressable>
        </View>
      </View>

      {(loading || products.length > 0) && (
        <View style={styles.listWrap}>
          <Text style={[styles.listLabel, { color: colors.mutedText }]}>
            Sản phẩm AI gợi ý hôm nay
          </Text>
          <AIRecommendSection
            title=""
            subtitle=""
            products={products}
            loading={loading}
            hideHeader
          />
        </View>
      )}
    </View>
  );
}

export const AIExploreHomeSection = memo(AIExploreHomeSectionInner);

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  titleRow: { marginBottom: 4 },
  kicker: { fontSize: 12, fontWeight: "700" },
  headline: { fontSize: 17, fontWeight: "700", marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  tripletOuter: {
    alignSelf: "stretch",
    width: "100%",
  },
  subLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  subLink: { paddingVertical: 4, paddingHorizontal: 4 },
  subLinkText: { fontSize: 13, fontWeight: "600" },
  listWrap: { marginTop: 12 },
  listLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    paddingHorizontal: 0,
  },
});
