import "@/global.css";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { useAppColors } from "@/hooks/use-app-colors";
import { getProductsByBrandId } from "@/services/productService";
import type { Product } from "@/types/product";
import { ProductCardTile } from "@/components/product/ProductCardTile";

export default function BrandDetailScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<{ id?: string }>();
  const brandId = useMemo(() => Number(params.id), [params.id]);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!Number.isFinite(brandId)) return;
      setLoading(true);
      try {
        const page = await getProductsByBrandId(brandId, 0, 24);
        if (!mounted) return;
        setItems(Array.isArray(page.content) ? page.content : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [brandId]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-3 text-[18px] font-semibold" style={{ color: colors.text }}>
          Brand #{brandId}
        </Text>
        {loading ? (
          <Text style={{ color: colors.mutedText }}>Đang tải...</Text>
        ) : items.length === 0 ? (
          <Text style={{ color: colors.mutedText }}>Chưa có sản phẩm.</Text>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {items.map((p) => (
              <View key={p.id} className="mb-3">
                <ProductCardTile product={p} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

