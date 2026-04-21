import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

export function CategorySection({
  title,
  subtitle,
  categories,
  loading = false,
  onSeeAll,
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
  });

  const children = childrenQ.data ?? [];
  const childrenLoading = childrenQ.isPending;

  if (!loading && roots.length === 0) return null;

  return (
    <View className="px-4 pb-4 pt-2">
      <View className="mb-2 flex-row items-end justify-between">
        <View>
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-0.5 text-[11px]"
              style={{ color: colors.mutedText }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        {loading && roots.length === 0 ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                className="mr-2 h-8 w-20 rounded-full"
                style={{ backgroundColor: colors.surfaceMuted }}
              />
            ))}
          </>
        ) : (
          roots.map((r) => {
            const isActive = r.id === activeRootId;
            return (
              <Pressable
                key={r.id}
                onPress={() => setActiveRootId(r.id)}
                className="mr-2 h-8 items-center justify-center rounded-full px-4"
                style={{
                  backgroundColor: isActive ? colors.tint : colors.surfaceMuted,
                }}
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <Text
                  numberOfLines={1}
                  className="text-[12px] font-semibold"
                  style={{ color: isActive ? "#fff" : colors.text }}
                >
                  {r.name}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading || childrenLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} className="mr-3" style={{ width: 72 }}>
                <View
                  className="rounded-full"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: colors.surfaceMuted,
                    marginBottom: 8,
                  }}
                />
                <View
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: colors.surfaceMuted }}
                />
              </View>
            ))}
          </>
        ) : (
          children.map((c) => {
            const resolved = resolveAssetUrl(c.imageUrl);
            const finalUrl = resolved ?? c.imageUrl ?? null;

            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  useShopNavStore.getState().setPending({
                    categorySlug: c.slug,
                    categoryName: c.name,
                  });
                  router.push("/(tabs)/shop" as any);
                }}
                className="mr-3 items-center"
                style={{ width: 72 }}
                android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: colors.surfaceMuted,
                    overflow: "hidden",
                  }}
                >
                  {finalUrl ? (
                    <Image
                      source={{ uri: finalUrl }}
                      style={{ width: 64, height: 64 }}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <Text
                      className="text-[16px] font-semibold"
                      style={{ color: colors.mutedText }}
                    >
                      {c.name?.trim()?.slice(0, 1)?.toUpperCase() ?? "•"}
                    </Text>
                  )}
                </View>

                <Text
                  numberOfLines={2}
                  className="mt-2 text-center text-[11px] font-medium"
                  style={{ color: colors.text, lineHeight: 14 }}
                >
                  {c.name}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
