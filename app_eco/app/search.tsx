import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  type ListRenderItemInfo,
  type TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import "@/global.css";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { getBestDeals, getFeaturedProducts, getMostPopular, getNewArrivals, searchProducts } from "@/services/productService";
import type { Product } from "@/types/product";
import { ProductCardSmall } from "@/components/home/ProductCardSmall";
import { navLockRun } from "@/utils/navLock";
import { useSearchStore } from "@/store/searchStore";

type TabType = "featured" | "trending" | "new" | "sale";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

export default function SearchScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [keyword, setKeyword] = useState("");
  // Không gọi BE theo từng ký tự; chỉ dùng debounced để gợi ý UI.
  const debounced = useDebouncedValue(keyword.trim(), 420);
  const [confirmedKeyword, setConfirmedKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const addRecent = useSearchStore((s) => s.addRecent);
  const recentKeywords = useSearchStore((s) => s.recentKeywords);
  const clearRecent = useSearchStore((s) => s.clearRecent);
  const removeRecent = useSearchStore((s) => s.removeRecent);

  const inputRef = useRef<TextInput | null>(null);
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const showSearch = confirmedKeyword.trim().length >= 2;
  const pageSize = 16;

  const searchQ = useInfiniteQuery({
    queryKey: ["productSearch", confirmedKeyword],
    enabled: showSearch,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      searchProducts(confirmedKeyword, pageParam as number, pageSize),
    getNextPageParam: (lastPage) => {
      const n = lastPage.number ?? 0;
      const total = lastPage.totalPages ?? 1;
      return n + 1 >= total ? undefined : n + 1;
    },
  });

  const tabQ = useQuery({
    queryKey: ["searchTabProducts", activeTab],
    enabled: !showSearch,
    queryFn: async () => {
      switch (activeTab) {
        case "featured":
          return getFeaturedProducts(12);
        case "trending":
          return getMostPopular(12);
        case "new":
          return getNewArrivals(12);
        case "sale":
          return getBestDeals(12);
      }
    },
  });

  const items = useMemo<Product[]>(() => {
    if (showSearch) return searchQ.data?.pages.flatMap((p) => p.content) ?? [];
    return tabQ.data ?? [];
  }, [showSearch, searchQ.data, tabQ.data]);

  const title = useMemo(() => {
    if (showSearch) return `Kết quả cho “${confirmedKeyword}”`;
    switch (activeTab) {
      case "featured":
        return "Sản phẩm nổi bật";
      case "trending":
        return "Sản phẩm thịnh hành";
      case "new":
        return "Sản phẩm mới nhất";
      case "sale":
        return "Sản phẩm khuyến mãi";
    }
  }, [showSearch, debounced, activeTab]);

  const renderTab = (id: TabType, label: string) => {
    const active = activeTab === id;
    return (
      <CustomButton
        title={label}
        variant={active ? "primary" : "secondary"}
        onPress={() => {
          setActiveTab(id);
          setKeyword("");
          setConfirmedKeyword("");
        }}
        style={{
          marginRight: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? colors.tint : colors.border,
        }}
      />
    );
  };

  const onSubmitKeyword = (kw: string) => {
    const k = kw.trim();
    if (k.length < 2) return;
    setKeyword(k);
    setConfirmedKeyword(k);
    addRecent(k);
  };

  const isInitialLoadingOverlay = showSearch
    ? searchQ.isFetching && items.length === 0
    : tabQ.isFetching && items.length === 0;

  const showDimOverlay = showSearch && searchQ.isFetching && items.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LoadingSpinner visible={isInitialLoadingOverlay} message="Đang tìm kiếm…" fullscreen />

      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <CustomIconButton
            onPress={() => navLockRun(() => router.back())}
            accessibilityLabel="Trở lại"
          >
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AppIcon name="search" size={18} color={colors.mutedText} style={{ marginRight: 6 }} />
              <CustomInput
                ref={inputRef}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="Bạn muốn tìm gì?"
                returnKeyType="search"
                onSubmitEditing={() => onSubmitKeyword(keyword)}
                autoCapitalize="none"
                containerStyle={{ flex: 1, marginBottom: 0 }}
                style={{
                  flex: 1,
                  borderWidth: 0,
                  backgroundColor: "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                  minHeight: 40,
                  fontSize: 14,
                }}
              />
              {showSearch && searchQ.isFetching ? (
                <View style={{ marginLeft: 8 }}>
                  <LoadingSpinner visible inline />
                </View>
              ) : null}
              {keyword.length ? (
                <CustomIconButton
                  onPress={() => {
                    setKeyword("");
                    setConfirmedKeyword("");
                  }}
                  accessibilityLabel="Xoá từ khoá"
                  size={32}
                  style={{ marginLeft: 4, backgroundColor: colors.surfaceMuted }}
                >
                  <AppIcon name="x" size={18} color={colors.text} />
                </CustomIconButton>
              ) : null}
            </View>
          </View>

          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>

      {!showSearch ? (
        <View className="px-4 pb-2">
          <Text className="mt-2 text-sm font-semibold" style={{ color: colors.text }}>
            Gợi ý tìm kiếm
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            className="mt-3"
          >
            <View className="flex-row">
              {renderTab("featured", "Nổi bật")}
              {renderTab("trending", "Thịnh hành")}
              {renderTab("new", "Mới nhất")}
              {renderTab("sale", "Khuyến mãi")}
            </View>
          </ScrollView>

          {recentKeywords.length ? (
            <View className="mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                  Lịch sử tìm kiếm
                </Text>
                <CustomButton
                  title="Xoá"
                  variant="secondary"
                  onPress={clearRecent}
                  style={{ paddingVertical: 6, paddingHorizontal: 12 }}
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                className="mt-3"
              >
                <View className="flex-row">
                  {recentKeywords.slice(0, 12).map((kw) => (
                    <View
                      key={kw}
                      className="mr-2 flex-row items-center rounded-full px-4 py-2"
                      style={{
                        backgroundColor: colors.surfaceMuted,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <CustomButton
                        title={kw}
                        variant="secondary"
                        onPress={() => onSubmitKeyword(kw)}
                        titleColor={colors.text}
                        titleStyle={{ fontSize: 13, fontWeight: "700" }}
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 2,
                          backgroundColor: "transparent",
                          borderWidth: 0,
                        }}
                        accessibilityLabel={`Tìm ${kw}`}
                      />
                      <CustomIconButton
                        onPress={() => removeRecent(kw)}
                        accessibilityLabel={`Xoá ${kw} khỏi lịch sử`}
                        size={28}
                        style={{ marginLeft: 8, backgroundColor: colors.background }}
                      >
                        <AppIcon name="x" size={16} color={colors.mutedText} />
                      </CustomIconButton>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      ) : (
        <View className="px-4 pb-2">
          <Text className="mt-2 text-sm font-semibold" style={{ color: colors.text }}>
            {title}
          </Text>
          {debounced.length >= 2 && debounced !== confirmedKeyword ? (
            <Text className="mt-1 text-xs" style={{ color: colors.mutedText }}>
              Nhấn Enter để tìm “{debounced}”
            </Text>
          ) : null}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          onEndReachedThreshold={0.35}
          onEndReached={() => {
            if (showSearch && searchQ.hasNextPage && !searchQ.isFetchingNextPage) {
              searchQ.fetchNextPage();
            }
          }}
          ListEmptyComponent={
            !isInitialLoadingOverlay ? (
              <View className="px-4 pt-8">
                <Text className="text-center text-sm" style={{ color: colors.mutedText }}>
                  {showSearch ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm gợi ý"}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }: ListRenderItemInfo<Product>) => (
            <View style={{ width: "48%", marginTop: 16 }}>
              <ProductCardSmall
                product={item}
                variant="grid"
                onPress={() =>
                  navLockRun(() =>
                    router.push(`/product-details/product-detail?id=${item.id}` as any)
                  )
                }
              />
            </View>
          )}
        />

        {showDimOverlay ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor:
                colors.scheme === "light"
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(0,0,0,0.35)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingSpinner
              visible
              fullscreen={false}
              message=""
              style={{ backgroundColor: "transparent", paddingVertical: 0 }}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

