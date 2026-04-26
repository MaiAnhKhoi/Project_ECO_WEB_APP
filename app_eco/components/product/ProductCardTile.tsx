import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";
import { HeartButton } from "./HeartButton";
import { useWishlistStore } from "@/store/wishlistStore";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  product: Product;
  onPress?: () => void;
  onWishlistToggle?: (productId: number) => void;
};

const BADGE_ABSOLUTE = { position: "absolute" as const, top: 8, right: 8 };
const SALE_ABSOLUTE = { position: "absolute" as const, top: 8, left: 8 };
const IMG_STYLE = { width: "100%" as const, height: 136 };
const CARD_HEIGHT = { height: 220 };

function ProductCardTileInner({ product, onPress, onWishlistToggle }: Props) {
  const router = useRouter();
  const colors = useAppColors();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const showSale = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handlePress = useCallback(() => {
    if (onPress) { onPress(); return; }
    router.push(`/product/${product.id}` as any);
  }, [onPress, product.id, router]);

  const handleHeartPress = useCallback(() => {
    if (onWishlistToggle) { onWishlistToggle(product.id); return; }
    toggleWishlist(product.id);
  }, [onWishlistToggle, toggleWishlist, product.id]);

  const imageUri = resolveAssetUrl(product.imgSrc) ?? product.imgSrc;

  return (
    <Pressable
      onPress={handlePress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <View style={[styles.card, CARD_HEIGHT, { backgroundColor: colors.surfaceMuted }]}>
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
          {showSale && discountPercent !== null ? (
            <View style={[SALE_ABSOLUTE, styles.saleBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.saleBadgeText}>-{discountPercent}%</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.info}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
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

export const ProductCardTile = memo(ProductCardTileInner);

const styles = StyleSheet.create({
  container: { width: "48%", opacity: 1 },
  card: { borderRadius: 14, overflow: "hidden" },
  info: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  titleWrap: { height: 36 },
  title: { fontSize: 13, fontWeight: "500" },
  priceRow: { marginTop: 4, flexDirection: "row", alignItems: "baseline" },
  price: { fontSize: 14, fontWeight: "600" },
  oldPrice: { marginLeft: 4, fontSize: 11, textDecorationLine: "line-through" },
  saleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  saleBadgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },
});
