import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import type { ProductSuggestion } from "@/types/ai";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  title: string;
  subtitle?: string;
  products: ProductSuggestion[];
  loading?: boolean;
  /** Chỉ danh sách ngang — khi section cha đã có tiêu đề (vd. Khám phá với AI) */
  hideHeader?: boolean;
};

/**
 * AIRecommendSection — hiển thị sản phẩm do AI gợi ý.
 * Pattern giống ProductSection (horizontal scroll + skeleton).
 * Dùng ProductSuggestion thay vì Product — mirror web AIRecommendSection.
 */
function AIRecommendSectionInner({
  title,
  subtitle,
  products,
  loading = false,
  hideHeader = false,
}: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const handlePress = useCallback(
    (productId: number) => {
      router.push(`/product/${productId}` as any);
    },
    [router]
  );

  if (!loading && products.length === 0) return null;

  return (
    <View style={[styles.container, hideHeader && styles.containerFlat]}>
      {!hideHeader ? (
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={[styles.aiBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.aiBadgeText}>✨ AI</Text>
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={SCROLL_CONTENT}
      >
        {loading && products.length === 0
          ? SKELETON_KEYS.map((k) => (
              <View
                key={k}
                style={[styles.skeleton, { backgroundColor: colors.surfaceMuted }]}
              />
            ))
          : products.map((p) => (
              <AIProductCard
                key={p.id}
                product={p}
                colors={colors}
                onPress={() => handlePress(p.id)}
              />
            ))}
      </ScrollView>
    </View>
  );
}

export const AIRecommendSection = memo(AIRecommendSectionInner);

// ============================================================
// AIProductCard — card nhỏ cho từng sản phẩm AI gợi ý
// ============================================================

type CardProps = {
  product: ProductSuggestion;
  colors: ReturnType<typeof useAppColors>;
  onPress: () => void;
};

function AIProductCard({ product, colors, onPress }: CardProps) {
  const imageUri =
    resolveAssetUrl(product.imageUrl ?? "") ?? product.imageUrl ?? "";

  const showSale =
    product.originalPrice != null && product.originalPrice > product.price;

  const discountPercent =
    showSale && product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={styles.cardContainer}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      className="active:opacity-80"
    >
      <View style={[styles.card, { backgroundColor: colors.surfaceMuted }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />

        {/* Discount badge */}
        {showSale && discountPercent !== null ? (
          <View style={[styles.saleBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.saleBadgeText}>-{discountPercent}%</Text>
          </View>
        ) : null}

        <View style={styles.cardInfo}>
          <Text
            numberOfLines={2}
            style={[styles.cardName, { color: colors.text }]}
          >
            {product.name}
          </Text>

          {/* Lý do AI gợi ý (nếu có) */}
          {product.reason ? (
            <Text
              numberOfLines={1}
              style={[styles.cardReason, { color: colors.mutedText }]}
            >
              {product.reason}
            </Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.tint }]}>
              {product.price.toLocaleString("vi-VN")}₫
            </Text>
            {showSale && product.originalPrice ? (
              <Text style={[styles.oldPrice, { color: colors.mutedText }]}>
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const SCROLL_CONTENT = { paddingRight: 16 };
const SKELETON_KEYS = [0, 1, 2];

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  containerFlat: { paddingHorizontal: 0, paddingTop: 4, paddingBottom: 0 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { marginTop: 2, fontSize: 11 },
  aiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  aiBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  skeleton: { marginRight: 12, width: 160, height: 210, borderRadius: 16 },
  cardContainer: { marginRight: 12, width: 160 },
  card: { borderRadius: 14, overflow: "hidden", height: 230 },
  cardImage: { width: "100%", height: 140 },
  saleBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  saleBadgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 12, fontWeight: "500", height: 36 },
  cardReason: { fontSize: 10, marginTop: 2, marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 2 },
  price: { fontSize: 13, fontWeight: "600" },
  oldPrice: { fontSize: 10, textDecorationLine: "line-through" },
});
