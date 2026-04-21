import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

import { ProductCardTile } from "@/components/product/ProductCardTile";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  initialLoading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  hasMore: boolean;
  /** Tổng từ server (pagination) */
  totalElements: number;
  /** Số dòng đã tải (tránh nhầm với total khi chưa load hết) */
  loadedCount: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onWishlistToggle: (productId: number) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
};

export function ShopProductGrid({
  products,
  initialLoading,
  loadingMore,
  refreshing,
  hasMore,
  totalElements,
  loadedCount,
  onRefresh,
  onLoadMore,
  onWishlistToggle,
  ListHeaderComponent,
  ListEmptyComponent,
}: Props) {
  const colors = useAppColors();

  if (initialLoading) {
    return (
      <View className="flex-1">
        <LoadingSpinner visible fullscreen={false} style={{ flex: 1 }} />
      </View>
    );
  }

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View className="items-center py-6">
          <LoadingSpinner visible inline />
        </View>
      );
    }
    if (!hasMore && loadedCount > 0) {
      const label =
        totalElements > 0
          ? `Đã hiển thị ${loadedCount}/${totalElements} sản phẩm`
          : `Đã hiển thị ${loadedCount} sản phẩm`;
      return (
        <View className="items-center py-8">
          <Text className="text-[12px]" style={{ color: colors.mutedText }}>
            {label}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => String(p.id)}
      numColumns={2}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 12,
        flexGrow: 1,
      }}
      columnWrapperStyle={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
      }
      onEndReached={() => {
        if (!hasMore || initialLoading || refreshing || loadingMore) return;
        onLoadMore();
      }}
      onEndReachedThreshold={0.2}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent ?? null}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <ProductCardTile product={item} onWishlistToggle={onWishlistToggle} />
      )}
    />
  );
}
