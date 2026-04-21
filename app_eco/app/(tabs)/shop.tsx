import "@/global.css";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppScreenShell } from "@/components/layout";
import { ShopEmptyState } from "@/components/shop/ShopEmptyState";
import { ShopFilterChips } from "@/components/shop/ShopFilterChips";
import { ShopFilterModal } from "@/components/shop/ShopFilterModal";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { usePagedList } from "@/hooks/usePagedList";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { filterApi } from "@/services/filterApi";
import { getShopProducts } from "@/services/productService";
import { useShopNavStore } from "@/store/shopNavStore";
import type { FilterResponse, ShopFilters } from "@/types/filter";
import type { Product } from "@/types/product";
import { SHOP_DEFAULT_FILTERS, shopFiltersActive } from "@/types/filter";
import { navLockRun } from "@/utils/navLock";

const PAGE_SIZE = 16;

export default function ShopScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // ── Filter meta (brands, colors, price range) ──
  const [filterMeta, setFilterMeta] = useState<FilterResponse | null>(null);
  const [filters, setFilters] = useState<ShopFilters>(SHOP_DEFAULT_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [navTitle, setNavTitle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    filterApi.getGlobalFilters().then(setFilterMeta).catch(() => {});
  }, []);

  const globalMin = filterMeta?.price.min ?? 0;
  const globalMax = filterMeta?.price.max ?? 0;
  const filtersOn = shopFiltersActive(filters, globalMin, globalMax);

  // ── Pagination — fetchFn thay đổi khi searchQuery/filters thay đổi → tự reset trang 0 ──
  const fetchFn = useCallback(
    async (page: number) => {
      const sq = searchQuery.trim();
      if (sq) {
        const { searchProducts } = await import("@/services/productService");
        return searchProducts(sq, page, PAGE_SIZE);
      }
      return getShopProducts(page, PAGE_SIZE, filters);
    },
    [searchQuery, filters],
  );

  const {
    items: products,
    totalElements,
    initialLoading,
    loadingMore,
    refreshing,
    hasMore,
    onRefresh,
    onLoadMore,
  } = usePagedList<Product>(fetchFn, { pageSize: PAGE_SIZE, getKey: (p) => p.id });

  // ── Wishlist (optimistic) ──
  const handleWishlistToggle = useWishlistToggle();

  // ── Filter handlers ──
  const patchFilter = useCallback((patch: Partial<ShopFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleApplyFilter = useCallback((next: ShopFilters) => {
    setFilters(next);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(SHOP_DEFAULT_FILTERS);
    setNavTitle(null);
  }, []);

  // ── Search handlers ──
  const handleSearchClose = useCallback(() => {
    setSearchActive(false);
    setSearchQuery("");
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // ── Navigation ──
  const handleHeaderBack = useCallback(() => {
    if (searchActive) {
      handleSearchClose();
      return;
    }
    navLockRun(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      router.push("/(tabs)/index" as any);
    });
  }, [searchActive, handleSearchClose, navigation, router]);

  /** Khi navigate từ category/brand → shop: áp filter tương ứng */
  useFocusEffect(
    useCallback(() => {
      const pending = useShopNavStore.getState().pending;
      if (!pending) return;
      useShopNavStore.getState().clearPending();

      const newFilters: ShopFilters = { ...SHOP_DEFAULT_FILTERS };
      let title: string | null = null;

      if (pending.categorySlug) {
        newFilters.categorySlug = pending.categorySlug;
        title = pending.categoryName ?? pending.categorySlug;
      }
      if (pending.brandId !== undefined) {
        newFilters.brandId = pending.brandId;
        title = pending.brandName ? `Thương hiệu: ${pending.brandName}` : title;
      }

      setFilters(newFilters);
      setNavTitle(title);
    }, []),
  );

  /** Đóng search khi rời tab */
  useFocusEffect(
    useCallback(() => {
      return () => setSearchActive(false);
    }, []),
  );

  // ── Computed display ──
  const headerTitle = navTitle ?? "Cửa hàng";

  const subtitle = useMemo(() => {
    if (initialLoading && products.length === 0) return undefined;
    if (products.length === 0 && totalElements === 0) return undefined;
    const extra = filtersOn ? " · Đã lọc" : "";
    const n = totalElements > 0 ? totalElements : products.length;
    return `${n} sản phẩm${extra}`;
  }, [initialLoading, products.length, totalElements, filtersOn]);

  const emptyComponent =
    !initialLoading && !refreshing && products.length === 0 ? (
      <ShopEmptyState
        isFiltered={filtersOn || searchQuery.trim().length > 0}
        onClearFilter={handleClearAllFilters}
      />
    ) : null;

  return (
    <AppScreenShell
      header={
        <ShopHeader
          title={headerTitle}
          subtitle={subtitle}
          onBack={handleHeaderBack}
          searchActive={searchActive}
          searchQuery={searchQuery}
          onSearchFocus={() => setSearchActive(true)}
          onSearchChange={handleSearchChange}
          onSearchClear={() => handleSearchChange("")}
          onSearchClose={handleSearchClose}
          filterActive={filtersOn}
          onOpenFilter={() => {
            Haptics.selectionAsync();
            setFilterModalOpen(true);
          }}
        />
      }
      stickyBelowHeader={
        <ShopFilterChips
          filters={filters}
          globalMin={globalMin}
          globalMax={globalMax}
          brands={filterMeta?.brands ?? []}
          colors={filterMeta?.colors ?? []}
          onPatchFilter={patchFilter}
          onClearAll={handleClearAllFilters}
        />
      }
      overlay={
        <ShopFilterModal
          visible={filterModalOpen}
          filters={filterMeta}
          current={filters}
          onApply={handleApplyFilter}
          onClose={() => setFilterModalOpen(false)}
        />
      }
    >
      <ShopProductGrid
        products={products}
        initialLoading={initialLoading && products.length === 0}
        loadingMore={loadingMore}
        refreshing={refreshing}
        hasMore={hasMore}
        totalElements={totalElements}
        loadedCount={products.length}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        onWishlistToggle={handleWishlistToggle}
        ListEmptyComponent={emptyComponent}
      />
    </AppScreenShell>
  );
}
