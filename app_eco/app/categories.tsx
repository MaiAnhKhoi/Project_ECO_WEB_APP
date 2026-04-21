import "@/global.css";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAppColors } from "@/hooks/use-app-colors";
import { getRootCategories } from "@/services/categoryService";
import type { CategoryItem } from "@/types/category";

export default function CategoriesScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRootCategories();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-3 text-[18px] font-semibold" style={{ color: colors.text }}>
          Danh mục
        </Text>
        {loading ? (
          <Text style={{ color: colors.mutedText }}>Đang tải...</Text>
        ) : (
          <View>
            {items.map((c) => (
              <View
                key={c.id}
                className="mb-2 rounded-2xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <Text
                  className="text-[14px] font-semibold"
                  style={{ color: colors.text }}
                  onPress={() => router.push(`/category/${c.slug}`)}
                >
                  {c.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

