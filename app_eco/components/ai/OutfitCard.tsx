import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Outfit } from "@/types/ai";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  outfit: Outfit;
  /** Index hiển thị (1, 2, 3…) */
  index: number;
  onAddToCart?: (outfit: Outfit) => void;
};

function OutfitCardInner({ outfit, index, onAddToCart }: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(outfit);
  }, [onAddToCart, outfit]);

  const handleViewProduct = useCallback(
    (productId: number) => {
      router.push(`/product/${productId}` as any);
    },
    [router]
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
      ]}
    >
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View
          style={[styles.badgeWrap, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.badgeText}>Outfit {index}</Text>
        </View>
        <Text style={[styles.outfitName, { color: colors.text }]} numberOfLines={1}>
          {outfit.name}
        </Text>
      </View>

      {/* Occasion + style tags */}
      <View style={styles.tagRow}>
        {outfit.occasion ? (
          <View
            style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Text style={[styles.tagText, { color: colors.mutedText }]}>
              {outfit.occasion}
            </Text>
          </View>
        ) : null}
        {outfit.style ? (
          <View
            style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Text style={[styles.tagText, { color: colors.mutedText }]}>
              {outfit.style}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Description */}
      {outfit.description ? (
        <Text
          style={[styles.description, { color: colors.mutedText }]}
          numberOfLines={2}
        >
          {outfit.description}
        </Text>
      ) : null}

      {/* Sản phẩm trong outfit — horizontal scroll (web dùng grid) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsRow}
      >
        {outfit.items.map((item) => {
          const imgUri = resolveAssetUrl(item.imageUrl ?? "") ?? item.imageUrl ?? "";
          return (
            <Pressable
              key={item.productId}
              onPress={() => handleViewProduct(item.productId)}
              style={[
                styles.itemCard,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              className="active:opacity-80"
            >
              <Image
                source={{ uri: imgUri }}
                style={styles.itemImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.itemInfo}>
                <Text
                  style={[styles.itemName, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {item.productName}
                </Text>
                {item.role ? (
                  <Text style={[styles.itemRole, { color: colors.mutedText }]}>
                    {item.role}
                  </Text>
                ) : null}
                <Text style={[styles.itemPrice, { color: colors.tint }]}>
                  {item.price.toLocaleString("vi-VN")}₫
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Total price + actions */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.divider },
        ]}
      >
        <View>
          <Text style={[styles.totalLabel, { color: colors.mutedText }]}>
            Tổng giá
          </Text>
          <Text style={[styles.totalPrice, { color: colors.tint }]}>
            {outfit.totalPrice.toLocaleString("vi-VN")}₫
          </Text>
        </View>

        <CustomButton
          title="Thêm vào giỏ"
          onPress={handleAddToCart}
          style={styles.addBtn as any}
        />
      </View>
    </View>
  );
}

export const OutfitCard = memo(OutfitCardInner);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  badgeWrap: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  outfitName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  itemsRow: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  itemCard: {
    width: 130,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: 110,
  },
  itemInfo: {
    padding: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  itemRole: {
    fontSize: 10,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
});
