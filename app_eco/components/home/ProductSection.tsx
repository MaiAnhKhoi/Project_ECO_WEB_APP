import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";

import { ProductCardSmall } from "./ProductCardSmall";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  onSeeAll?: () => void;
};

const SCROLL_CONTENT = { paddingRight: 16 };

function ProductSectionInner({
  title,
  subtitle,
  products,
  loading = false,
  onSeeAll,
}: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const handleSeeAll = useCallback(() => {
    if (onSeeAll) {
      onSeeAll();
      return;
    }
    router.push("/shop" as any);
  }, [onSeeAll, router]);

  if (!loading && products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <BlurView
          intensity={22}
          tint={colors.scheme === "dark" ? "dark" : "light"}
          style={styles.blurAbsolute}
        />
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Text
            onPress={handleSeeAll}
            style={[styles.seeAll, { color: colors.tint }]}
          >
            Xem tất cả
          </Text>
        </View>
      </View>

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
          : products.map((p) => <ProductCardSmall key={p.id} product={p} />)}
      </ScrollView>
    </View>
  );
}

export const ProductSection = memo(ProductSectionInner);

/** Pre-computed skeleton keys — avoids Array.from on every render. */
const SKELETON_KEYS = [0, 1, 2];

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  headerWrap: { position: "relative", marginBottom: 8 },
  blurAbsolute: {
    position: "absolute",
    left: -12,
    right: -12,
    top: -4,
    bottom: -4,
    borderRadius: 999,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { marginTop: 2, fontSize: 11 },
  seeAll: { fontSize: 11, fontWeight: "600" },
  skeleton: { marginRight: 12, width: 160, height: 190, borderRadius: 16 },
});
