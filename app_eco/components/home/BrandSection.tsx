import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { useShopNavStore } from "@/store/shopNavStore";
import type { Brand } from "@/types/brand";

type Props = {
  title: string;
  subtitle?: string;
  brands: Brand[];
  loading?: boolean;
  onSeeAll?: () => void;
};

export function BrandSection({
  title,
  subtitle,
  brands,
  loading = false,
  onSeeAll,
}: Props) {
  const colors = useAppColors();
  const router = useRouter();


  if (!loading && brands.length === 0) return null;

  return (
    <View className="px-4 pb-4 pt-2">
      <View className="mb-2 flex-row items-end justify-between">
        <View>
          <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[11px]" style={{ color: colors.mutedText }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading && brands.length === 0 ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                className="mr-2 h-9 w-24 rounded-full"
                style={{ backgroundColor: colors.surfaceMuted }}
              />
            ))}
          </>
        ) : (
          brands.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => {
                useShopNavStore.getState().setPending({
                  brandId: b.id,
                  brandName: b.name,
                });
                router.push("/(tabs)/shop" as any);
              }}
              className="mr-2 h-9 flex-row items-center rounded-full px-3"
              style={{ backgroundColor: colors.surfaceMuted }}
              android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            >
              <Text
                numberOfLines={1}
                className="text-[12px] font-semibold"
                style={{ color: colors.text }}
              >
                {b.name}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

