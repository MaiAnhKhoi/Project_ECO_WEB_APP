import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AIRecommendSection } from "@/components/ai/AIRecommendSection";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import type { ProductSuggestion } from "@/types/ai";
import { navLockRun } from "@/utils/navLock";

type Props = {
  products: ProductSuggestion[];
  loading?: boolean;
};

/**
 * Block “Khám phá với AI” trên Home: CTA Chat + Tạo outfit + carousel gợi ý (đồng bộ web).
 */
function AIExploreHomeSectionInner({ products, loading = false }: Props) {
  const colors = useAppColors();
  const router = useRouter();

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
          <Text style={[styles.kicker, { color: colors.tint }]}>✨ Khám phá với AI</Text>
        </View>
        <Text style={[styles.headline, { color: colors.text }]}>
          Hỏi mua sắm & tạo outfit
        </Text>
        <Text style={[styles.desc, { color: colors.mutedText }]}>
          Chat với UTE Shop AI hoặc tạo 3 bộ outfit từ sản phẩm có trong shop.
        </Text>

        <View style={styles.ctaRow}>
          <View style={styles.ctaHalf}>
            <CustomButton
              title="Chat với AI"
              variant="secondary"
              onPress={() => navLockRun(() => router.push("/ai-chat" as any))}
              leftIcon={<AppIcon name="message-circle" size={18} color={colors.text} />}
              style={styles.ctaBtn}
            />
          </View>
          <View style={styles.ctaHalf}>
            <CustomButton
              title="Tạo outfit"
              variant="primary"
              onPress={() => navLockRun(() => router.push("/ai-stylist" as any))}
              leftIcon={<AppIcon name="layers" size={18} color="#fff" />}
              style={styles.ctaBtn}
            />
          </View>
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
  desc: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  ctaRow: { flexDirection: "row", gap: 10 },
  ctaHalf: { flex: 1, minWidth: 0 },
  ctaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  listWrap: { marginTop: 12 },
  listLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    paddingHorizontal: 0,
  },
});
