import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { getCategoriesByParentId } from "@/services/categoryService";
import { useShopNavStore } from "@/store/shopNavStore";
import type { CategoryItem } from "@/types/category";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  title: string;
  subtitle?: string;
  categories: CategoryItem[];
  loading?: boolean;
  onSeeAll?: () => void;
};

const SKELETON_TABS = [0, 1, 2, 3] as const;
const SKELETON_CHILDREN = [0, 1, 2, 3, 4, 5] as const;

const RIPPLE_DEFAULT = { color: "rgba(0,0,0,0.06)" };
const RIPPLE_BORDERLESS = { color: "rgba(0,0,0,0.06)", borderless: true };

type RootTabProps = {
  item: CategoryItem;
  isActive: boolean;
  onPress: (id: number) => void;
  activeColor: string;
  inactiveColor: string;
  textColor: string;
};

const RootTab = memo(function RootTab({
  item,
  isActive,
  onPress,
  activeColor,
  inactiveColor,
  textColor,
}: RootTabProps) {
  const handlePress = useCallback(() => onPress(item.id), [onPress, item.id]);
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.rootTab,
        { backgroundColor: isActive ? activeColor : inactiveColor },
      ]}
      android_ripple={RIPPLE_DEFAULT}
    >
      <Text
        numberOfLines={1}
        style={[styles.rootTabText, { color: isActive ? "#fff" : textColor }]}
      >
        {item.name}
      </Text>
    </Pressable>
  );
});

type ChildCategoryItemProps = {
  item: CategoryItem;
  onPress: (slug: string, name: string) => void;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
};

const ChildCategoryItem = memo(function ChildCategoryItem({
  item,
  onPress,
  surfaceColor,
  textColor,
  mutedTextColor,
}: ChildCategoryItemProps) {
  const imageUrl = resolveAssetUrl(item.imageUrl) ?? item.imageUrl ?? null;
  const handlePress = useCallback(
    () => onPress(item.slug, item.name),
    [onPress, item.slug, item.name],
  );
  return (
    <Pressable
      onPress={handlePress}
      style={styles.childItem}
      android_ripple={RIPPLE_BORDERLESS}
    >
      <View style={[styles.childImageWrap, { backgroundColor: surfaceColor }]}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.childImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Text style={[styles.childInitial, { color: mutedTextColor }]}>
            {item.name?.trim()?.slice(0, 1)?.toUpperCase() ?? "•"}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={2}
        style={[styles.childName, { color: textColor }]}
      >
        {item.name}
      </Text>
    </Pressable>
  );
});

function CategorySectionInner({
  title,
  subtitle,
  categories,
  loading = false,
}: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const roots = useMemo(() => categories ?? [], [categories]);
  const [activeRootId, setActiveRootId] = useState<number | null>(
    roots.length > 0 ? roots[0].id : null,
  );

  useEffect(() => {
    if (roots.length === 0) {
      setActiveRootId(null);
      return;
    }
    setActiveRootId((prev) => (prev == null ? roots[0].id : prev));
  }, [roots]);

  const childrenQ = useQuery({
    queryKey: ["categories", "children", activeRootId],
    queryFn: () => getCategoriesByParentId(activeRootId!),
    enabled: activeRootId != null,
    staleTime: 5 * 60_000,
  });

  const children = childrenQ.data ?? [];

  const handleRootPress = useCallback((id: number) => setActiveRootId(id), []);

  const handleChildPress = useCallback(
    (slug: string, name: string) => {
      useShopNavStore.getState().setPending({ categorySlug: slug, categoryName: name });
      router.push("/(tabs)/shop" as any);
    },
    [router],
  );

  if (!loading && roots.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>{subtitle}</Text>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rootScroll}>
        {loading && roots.length === 0
          ? SKELETON_TABS.map((k) => (
              <View key={k} style={[styles.rootTabSkeleton, { backgroundColor: colors.surfaceMuted }]} />
            ))
          : roots.map((r) => (
              <RootTab
                key={r.id}
                item={r}
                isActive={r.id === activeRootId}
                onPress={handleRootPress}
                activeColor={colors.tint}
                inactiveColor={colors.surfaceMuted}
                textColor={colors.text}
              />
            ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading || childrenQ.isPending
          ? SKELETON_CHILDREN.map((k) => (
              <View key={k} style={styles.childSkeletonWrap}>
                <View style={[styles.childSkeletonCircle, { backgroundColor: colors.surfaceMuted }]} />
                <View style={[styles.childSkeletonText, { backgroundColor: colors.surfaceMuted }]} />
              </View>
            ))
          : children.map((c) => (
              <ChildCategoryItem
                key={c.id}
                item={c}
                onPress={handleChildPress}
                surfaceColor={colors.surfaceMuted}
                textColor={colors.text}
                mutedTextColor={colors.mutedText}
              />
            ))}
      </ScrollView>
    </View>
  );
}

export const CategorySection = memo(CategorySectionInner);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  header: { marginBottom: 8 },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { marginTop: 2, fontSize: 11 },
  rootScroll: { marginBottom: 12 },
  rootTab: {
    marginRight: 8,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  rootTabText: { fontSize: 12, fontWeight: "600" },
  rootTabSkeleton: { marginRight: 8, height: 32, width: 80, borderRadius: 999 },
  childItem: { marginRight: 12, alignItems: "center", width: 72 },
  childImageWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  childImage: { width: 64, height: 64 },
  childInitial: { fontSize: 16, fontWeight: "600" },
  childName: { marginTop: 8, textAlign: "center", fontSize: 11, fontWeight: "500", lineHeight: 14 },
  childSkeletonWrap: { marginRight: 12, width: 72 },
  childSkeletonCircle: { width: 64, height: 64, borderRadius: 32, marginBottom: 8 },
  childSkeletonText: { height: 12, width: 64, borderRadius: 4 },
});
