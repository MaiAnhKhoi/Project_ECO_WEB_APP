import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getProductDetail,
  getProductTabs,
  incrementProductViewCount,
} from "@/services/productService";
import type { Product } from "@/types/product";
import type { ProductTabsResponse } from "@/types/productDetail";
import { mapProductColorsFromApi } from "@/utils/mapProductColors";

type State = {
  product: Product | null;
  tabs: ProductTabsResponse | null;
  loading: boolean;
  error: string | null;
};

export function useProductDetail(productId: number | null) {
  const [state, setState] = useState<State>({
    product: null,
    tabs: null,
    loading: true,
    error: null,
  });

  const viewedRef = useRef<Set<number>>(new Set());

  const load = useCallback(async () => {
    if (productId == null || !Number.isFinite(productId)) {
      setState({ product: null, tabs: null, loading: false, error: "Thiếu mã sản phẩm" });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [product, tabs] = await Promise.all([
        getProductDetail(productId),
        getProductTabs(productId),
      ]);
      setState({ product, tabs, loading: false, error: null });

      if (!viewedRef.current.has(productId)) {
        viewedRef.current.add(productId);
        incrementProductViewCount(productId).catch(() => {
          viewedRef.current.delete(productId);
        });
      }
    } catch (e: any) {
      setState({
        product: null,
        tabs: null,
        loading: false,
        error: e?.message || "Không tải được sản phẩm",
      });
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const mappedColors = useMemo(
    () => (state.product ? mapProductColorsFromApi(state.product) : []),
    [state.product]
  );

  return {
    ...state,
    mappedColors,
    reload: load,
  };
}
