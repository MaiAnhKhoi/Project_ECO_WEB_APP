import "@/global.css";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { useAppColors } from "@/hooks/use-app-colors";
import { getProductsByCategorySlug } from "@/services/productService";
import type { Product } from "@/types/product";
import { ProductCardTile } from "@/components/product/ProductCardTile";

export default function CategoryDetailScreen() {
  const colors = useAppColors();
  const params = useLocalSearchParams<{ slug?: string }>();
  const slug = useMemo(() => String(params.slug || ""), [params.slug]);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getProductsByCategorySlug(slug, 24);
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-3 text-[18px] font-semibold" style={{ color: colors.text }}>
          {slug}
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

