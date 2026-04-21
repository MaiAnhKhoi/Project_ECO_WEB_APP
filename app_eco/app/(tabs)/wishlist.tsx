import "@/global.css";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

import { AppScreenShell } from "@/components/layout";
import { ProductCardTile } from "@/components/product/ProductCardTile";
import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";
import {
  WISHLIST_DEFAULT_FILTERS,
  WishlistFilterModal,
  wishlistFiltersActive,
  type WishlistFilters,
} from "@/components/wishlist/WishlistFilterModal";
import { WishlistHeader } from "@/components/wishlist/WishlistHeader";
import { WishlistEmptyState } from "@/components/wishlist/WishlistEmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import { wishlistApi } from "@/services/wishlistApi";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/product";
import { navLockRun } from "@/utils/navLock";

const PAGE_SIZE = 16;

function applyWishlistFilters(products: Product[], f: WishlistFilters): Product[] {
  let list = products.slice();
  list = list.filter((p) => {
    if (f.stock === "inStock" && p.inStock === false) return false;
    if (f.stock === "outOfStock" && p.inStock !== false) return false;
    if (f.sale === "onSale" && !(p.oldPrice != null && p.oldPrice > p.price)) return false;
    return true;
  });
  if (f.sort === "priceAsc") {
    list.sort((a, b) => a.price - b.price);
  } else if (f.sort === "priceDesc") {
    list.sort((a, b) => b.price - a.price);
  } else if (f.sort === "nameAsc") {
    list.sort((a, b) => a.title.localeCompare(b.title, "vi", { sensitivity: "base" }));
  }
  return list;
}

export default function WishlistScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const navigation = useNavigation();
  const token = useAuthStore((s) => s.accessToken);
  const isLoggedIn = !!token;

  const productIds = useWishlistStore((s) => s.productIds);
  const toggleLocal = useWishlistStore((s) => s.toggle);
  const removeLocal = useWishlistStore((s) => s.remove);
  const addLocal = useWishlistStore((s) => s.add);

  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serverLoading, setServerLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchedRef = useRef(false);
  /** Đã hoàn tất ít nhất một lần tải wishlist từ server (tránh đồng bộ focus trùng với lần tải đầu). */
  const wishlistListHydratedRef = useRef(false);

  const [guestProducts, setGuestProducts] = useState<Product[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);

  const [filters, setFilters] = useState<WishlistFilters>(WISHLIST_DEFAULT_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const fetchServerPage = useCallback(
    async (pageNum: number, reset = false) => {
      if (!token) return;
      if (!reset && pageNum >= totalPages) return;
      setServerLoading(true);
      try {
        const res = await wishlistApi.getWishlist(token, pageNum, PAGE_SIZE);
        const data = res as any;
        const content: Product[] = data?.content ?? [];
        const pages: number = data?.totalPages ?? 1;
        setTotalPages(pages);
        setServerProducts((prev) => (reset ? content : [...prev, ...content]));
        setPage(pageNum);
        if (reset) {
          useWishlistStore.getState().setProductIds(content.map((p) => p.id));
        } else {
          content.forEach((p) => addLocal(p.id));
        }
      } catch {
        // silent
      } finally {
        setServerLoading(false);
        wishlistListHydratedRef.current = true;
      }
    },
    [token, totalPages, addLocal]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      wishlistListHydratedRef.current = false;
      fetchedRef.current = false;
      setServerProducts([]);
      setPage(0);
      setTotalPages(1);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchServerPage(0, true);
    }
  }, [isLoggedIn, fetchServerPage]);

  /** Khi yêu thích được thêm từ màn khác (vd. chi tiết SP), store có ID nhưng danh sách server trên màn này có thể cũ. */
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn || !token || !wishlistListHydratedRef.current) return;
      let cancelled = false;
      const missing = productIds.filter((id) => !serverProducts.some((p) => p.id === id));
      if (missing.length === 0) return;
      (async () => {
        try {
          const { getProductDetail } = await import("@/services/productService");
          const results = await Promise.allSettled(missing.map((id) => getProductDetail(id)));
          if (cancelled) return;
          const products = results
            .filter((r): r is PromiseFulfilledResult<Product> => r.status === "fulfilled")
            .map((r) => r.value);
          setServerProducts((prev) => {
            const existing = new Set(prev.map((p) => p.id));
            const toAdd = products.filter((p) => !existing.has(p.id));
            if (toAdd.length === 0) return prev;
            return [...toAdd, ...prev];
          });
        } catch {
          // silent
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [isLoggedIn, token, productIds, serverProducts])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchedRef.current = false;
    await fetchServerPage(0, true);
    fetchedRef.current = true;
    setRefreshing(false);
  }, [fetchServerPage]);

  const loadMore = useCallback(() => {
    if (!serverLoading && page + 1 < totalPages) {
      fetchServerPage(page + 1);
    }
  }, [serverLoading, page, totalPages, fetchServerPage]);

  useEffect(() => {
    if (isLoggedIn || productIds.length === 0) {
      setGuestProducts([]);
      return;
    }
    const ctrl = { cancelled: false };
    setGuestLoading(true);
    (async () => {
      try {
        const { getProductDetail } = await import("@/services/productService");
        const results = await Promise.allSettled(productIds.map((id) => getProductDetail(id)));
        if (!ctrl.cancelled) {
          setGuestProducts(
            results
              .filter((r): r is PromiseFulfilledResult<Product> => r.status === "fulfilled")
              .map((r) => r.value)
          );
        }
      } finally {
        if (!ctrl.cancelled) setGuestLoading(false);
      }
    })();
    return () => {
      ctrl.cancelled = true;
    };
  }, [isLoggedIn, productIds]);

  const handleWishlistToggle = useCallback(
    async (productId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const isCurrently = useWishlistStore.getState().isWishlisted(productId);

      if (isLoggedIn && token) {
        try {
          if (isCurrently) {
            await wishlistApi.removeFromWishlist(token, productId);
            removeLocal(productId);
            setServerProducts((prev) => prev.filter((p) => p.id !== productId));
          } else {
            await wishlistApi.addToWishlist(token, productId);
            addLocal(productId);
            try {
              const { getProductDetail } = await import("@/services/productService");
              const p = await getProductDetail(productId);
              setServerProducts((prev) => {
                if (prev.some((x) => x.id === productId)) return prev;
                return [p, ...prev];
              });
            } catch {
              // Tim vẫn đúng; có thể kéo để làm mới
            }
          }
        } catch {
          toggleLocal(productId);
        }
      } else {
        toggleLocal(productId);
        if (isCurrently) {
          setGuestProducts((prev) => prev.filter((p) => p.id !== productId));
        }
      }
    },
    [isLoggedIn, token, toggleLocal, removeLocal, addLocal]
  );

  const displayProducts = isLoggedIn ? serverProducts : guestProducts;
  const filteredProducts = useMemo(
    () => applyWishlistFilters(displayProducts, filters),
    [displayProducts, filters]
  );

  const isLoading = isLoggedIn ? serverLoading && serverProducts.length === 0 : guestLoading;
  const totalCount = displayProducts.length;
  const filterOn = wishlistFiltersActive(filters);

  const headerSubtitle = useMemo(() => {
    if (totalCount === 0) return undefined;
    if (filterOn) {
      return `${filteredProducts.length}/${totalCount} sản phẩm · Đã lọc`;
    }
    return `${totalCount} sản phẩm`;
  }, [totalCount, filteredProducts.length, filterOn]);

  const resetFilters = useCallback(() => {
    setFilters(WISHLIST_DEFAULT_FILTERS);
    Haptics.selectionAsync();
  }, []);

  const handleBack = useCallback(() => {
    navLockRun(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      router.push("/(tabs)/shop" as any);
    });
  }, [navigation, router]);

  const renderFooter = () => {
    if (!serverLoading || serverProducts.length === 0) return null;
    return (
      <View className="items-center py-8">
        <LoadingSpinner visible inline />
      </View>
    );
  };

  const listEmpty =
    totalCount === 0 ? (
      <WishlistEmptyState onExplore={() => router.push("/(tabs)/shop" as any)} />
    ) : (
      <EmptyStateBlock
        iconName="filter"
        sectionLabel="Yêu thích"
        title="Không có sản phẩm phù hợp"
        description="Thử đổi bộ lọc hoặc đặt lại để xem toàn bộ danh sách."
        action={{ label: "Đặt lại bộ lọc", onPress: resetFilters }}
      />
    );

  return (
    <AppScreenShell
      header={
        <WishlistHeader
          subtitle={headerSubtitle}
          onBack={handleBack}
          onOpenFilter={() => {
            Haptics.selectionAsync();
            setFilterModalOpen(true);
          }}
          filterActive={filterOn}
        />
      }
      overlay={
        <WishlistFilterModal
          visible={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filters={filters}
          onChange={setFilters}
          onReset={() => {
            resetFilters();
          }}
        />
      }
    >
      {isLoading ? (
        <View className="flex-1">
          <LoadingSpinner visible fullscreen={false} style={{ flex: 1 }} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(p) => String(p.id)}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 28,
            gap: 12,
            flexGrow: 1,
          }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            isLoggedIn ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.tint}
              />
            ) : undefined
          }
          onEndReached={isLoggedIn ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <ProductCardTile product={item} onWishlistToggle={handleWishlistToggle} />
          )}
        />
      )}
    </AppScreenShell>
  );
}
