import { Image } from "expo-image";
import React, { memo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Testimonial } from "@/types/review";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  title: string;
  subtitle?: string;
  items: Testimonial[];
  loading?: boolean;
};

/** 5-star array reused across all cards — avoids Array.from on every render. */
const FIVE_STARS = [0, 1, 2, 3, 4] as const;

const SKELETON_KEYS = [0, 1] as const;

function TestimonialCardInner({ item }: { item: Testimonial }) {
  const colors = useAppColors();
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = resolveAssetUrl(item.image) ?? item.image ?? null;
  const showImage = Boolean(imageUrl) && !imageFailed;
  const initial = item.name?.trim()?.slice(0, 1)?.toUpperCase() ?? "•";

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceMuted }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardNameWrap}>
          <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.verifiedRow}>
            <AppIcon name="check-circle" size={12} color={colors.tint} />
            <Text style={[styles.verifiedText, { color: colors.mutedText }]}>
              Người mua đã xác minh
            </Text>
          </View>
        </View>

        <View style={styles.starsRow}>
          {FIVE_STARS.map((i) => (
            <AppIcon key={i} name="star" size={14} color="#F59E0B" />
          ))}
        </View>
      </View>

      <Text
        style={[styles.reviewText, { color: colors.mutedText }]}
        numberOfLines={4}
      >
        {item.review}
      </Text>

      <View style={[styles.productRow, { borderTopColor: "rgba(0,0,0,0.06)" }]}>
        <View
          style={[styles.productImage, { backgroundColor: "rgba(0,0,0,0.06)" }]}
        >
          {showImage ? (
            <Image
              source={{ uri: imageUrl! }}
              style={styles.productImageInner}
              contentFit="cover"
              transition={200}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Text style={[styles.productInitial, { color: colors.mutedText }]}>
              {initial}
            </Text>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={[styles.productLabel, { color: colors.mutedText }]}>
            Mặt hàng đã mua:
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.productName, { color: colors.text }]}
          >
            {item.product || "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const TestimonialCard = memo(TestimonialCardInner);

function TestimonialSectionInner({
  title,
  subtitle,
  items,
  loading = false,
}: Props) {
  const colors = useAppColors();

  if (!loading && items.length === 0) return null;

  const displayItems = items
    .filter((t) => Boolean(t?.review) && Boolean(t?.name))
    .slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading && items.length === 0
          ? SKELETON_KEYS.map((k) => (
              <View
                key={k}
                style={[styles.skeleton, { backgroundColor: colors.surfaceMuted }]}
              />
            ))
          : displayItems.map((t, idx) => (
              <TestimonialCard key={`${t.name ?? "t"}-${idx}`} item={t} />
            ))}
      </ScrollView>
    </View>
  );
}

export const TestimonialSection = memo(TestimonialSectionInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  sectionHeader: { marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600" },
  sectionSubtitle: { marginTop: 2, fontSize: 11 },
  skeleton: { marginRight: 12, width: 256, height: 120, borderRadius: 16 },

  card: { marginRight: 12, width: 288, borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  cardNameWrap: { flex: 1, paddingRight: 8 },
  cardName: { fontSize: 12, fontWeight: "600" },
  verifiedRow: { marginTop: 2, flexDirection: "row", alignItems: "center" },
  verifiedText: { marginLeft: 4, fontSize: 10 },
  starsRow: { flexDirection: "row", alignItems: "center" },
  reviewText: { marginTop: 8, fontSize: 12, lineHeight: 18 },
  productRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  productImageInner: { width: 56, height: 56 },
  productInitial: { fontSize: 18, fontWeight: "600" },
  productInfo: { flex: 1 },
  productLabel: { fontSize: 10 },
  productName: { marginTop: 2, fontSize: 12, fontWeight: "600" },
});
