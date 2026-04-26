import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HeartButton } from "@/components/product/HeartButton";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";
import { useWishlistStore } from "@/store/wishlistStore";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  product: Product;
  onPress?: () => void;
  variant?: "row" | "grid";
};

/** Stable style objects to avoid inline object creation every render. */
const BADGE_ABSOLUTE: { position: "absolute"; top: number; right: number } = {
  position: "absolute",
  top: 8,
  right: 8,
};
const SALE_ABSOLUTE: { position: "absolute"; top: number; left: number } = {
  position: "absolute",
  top: 8,
  left: 8,
};
const CARD_HEIGHT: { height: number } = { height: 220 };
const IMG_STYLE: { width: string; height: number } = { width: "100%", height: 136 };

function ProductCardSmallInner({ product, onPress, variant = "row" }: Props) {
  const router = useRouter();
  const colors = useAppColors();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const imageUri = resolveAssetUrl(product.imgSrc) ?? product.imgSrc;

  const showSale = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/product/${product.id}` as any);
  }, [onPress, product.id, router]);

  const handleHeartPress = useCallback(() => {
    toggleWishlist(product.id);
  }, [toggleWishlist, product.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={variant === "grid" ? styles.gridContainer : styles.rowContainer}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <View
        style={[
          styles.card,
          CARD_HEIGHT,
          { backgroundColor: colors.surfaceMuted },
        ]}
      >
        <View>
          <Image
            source={{ uri: imageUri }}
            style={IMG_STYLE as any}
            contentFit="cover"
            transition={200}
          />
          <View style={BADGE_ABSOLUTE}>
            <HeartButton active={isWishlisted} onPress={handleHeartPress} />
          </View>
          {showSale && discountPercent !== null && (
            <View
              style={[
                SALE_ABSOLUTE,
                styles.saleBadge,
                { backgroundColor: colors.tint },
              ]}
            >
              <Text style={styles.saleBadgeText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              style={[styles.title, { color: colors.text }]}
            >
              {product.title}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.tint }]}>
              {product.price.toLocaleString("vi-VN")}₫
            </Text>
            {showSale && product.oldPrice ? (
              <Text style={[styles.oldPrice, { color: colors.mutedText }]}>
                {product.oldPrice.toLocaleString("vi-VN")}₫
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const ProductCardSmall = memo(ProductCardSmallInner);

const styles = StyleSheet.create({
  rowContainer: { marginRight: 12, width: 160 },
  gridContainer: { width: "100%" },
  card: { borderRadius: 14, overflow: "hidden" },
  info: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  titleContainer: { height: 36 },
  title: { fontSize: 13, fontWeight: "500" },
  priceRow: { marginTop: 4, flexDirection: "row", alignItems: "baseline" },
  price: { fontSize: 14, fontWeight: "600" },
  oldPrice: { marginLeft: 4, fontSize: 11, textDecorationLine: "line-through" },
  saleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  saleBadgeText: { fontSize: 11, fontWeight: "600", color: "#FFFFFF" },
});
