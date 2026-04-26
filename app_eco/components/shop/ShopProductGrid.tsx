import React, { memo, useCallback } from "react";
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, View } from "react-native";

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
  totalElements: number;
  loadedCount: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onWishlistToggle: (productId: number) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
};

const CONTENT_STYLE = {
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 32,
  gap: 12,
  flexGrow: 1,
} as const;

const COL_WRAPPER = { gap: 12 } as const;

function ShopProductGridInner({
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

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductCardTile product={item} onWishlistToggle={onWishlistToggle} />
    ),
    [onWishlistToggle],
  );

  const handleEndReached = useCallback(() => {
    if (!hasMore || initialLoading || refreshing || loadingMore) return;
    onLoadMore();
  }, [hasMore, initialLoading, refreshing, loadingMore, onLoadMore]);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerCenter}>
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
        <View style={styles.footerCenter}>
          <Text style={[styles.footerText, { color: colors.mutedText }]}>{label}</Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, loadedCount, totalElements, colors.mutedText]);

  if (initialLoading) {
    return (
      <View style={styles.flex}>
        <LoadingSpinner visible fullscreen={false} style={styles.flex} />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => String(p.id)}
      numColumns={2}
      contentContainerStyle={CONTENT_STYLE}
      columnWrapperStyle={COL_WRAPPER}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={7}
      removeClippedSubviews
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent ?? null}
      ListFooterComponent={renderFooter}
      renderItem={renderItem}
    />
  );
}

export const ShopProductGrid = memo(ShopProductGridInner);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footerCenter: { alignItems: "center", paddingVertical: 24 },
  footerText: { fontSize: 12 },
});
