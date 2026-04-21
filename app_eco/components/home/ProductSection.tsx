import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

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

export function ProductSection({
  title,
  subtitle,
  products,
  loading = false,
  onSeeAll,
}: Props) {
  const colors = useAppColors();
  const router = useRouter();

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
      return;
    }
    router.push("/shop");
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <View className="px-4 pb-4 pt-2">
      <View style={{ position: "relative", marginBottom: 8 }}>
        <BlurView
          intensity={22}
          tint={colors.scheme === "dark" ? "dark" : "light"}
          style={{
            position: "absolute",
            left: -12,
            right: -12,
            top: -4,
            bottom: -4,
            borderRadius: 999,
          }}
        />
        <View className="flex-row items-center justify-between px-3 py-2">
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
          <Text
            onPress={handleSeeAll}
            className="text-[11px] font-semibold"
            style={{ color: colors.tint }}
          >
            Xem tất cả
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {loading && products.length === 0 ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <View
                key={i}
                className="mr-3 w-40 rounded-2xl"
                style={{ backgroundColor: colors.surfaceMuted, height: 190 }}
              />
            ))}
          </>
        ) : (
          products.map((p) => (
            <ProductCardSmall key={p.id} product={p} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

