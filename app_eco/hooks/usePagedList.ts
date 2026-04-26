import { useCallback, useEffect, useRef, useState } from "react";

export type PagedResult<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size?: number;
};

type Options<T> = {
  pageSize?: number;
  /**
   * Hàm lấy key duy nhất để loại trùng khi append.
   * Nếu không truyền, items không được dedup (vẫn an toàn nếu data không trùng).
   */
  getKey?: (item: T) => string | number;
  /**
   * false → hook không fetch (vd: chưa đăng nhập).
   * Khi chuyển về true, hook tự reset và fetch lại từ trang 0.
   * Mặc định: true.
   */
  enabled?: boolean;
};

/**
 * Hook tổng quát cho danh sách phân trang vô hạn với generation counter.
 *
 * Cách dùng:
 *   const fetchFn = useCallback((page) => api.getItems(token, page, PAGE_SIZE), [token]);
 *   const { items, onRefresh, onLoadMore, ... } = usePagedList(fetchFn);
 *
 * - Khi `fetchFn` thay đổi (deps của useCallback thay đổi), tự reset về trang 0 và re-fetch.
 * - `onRefresh`: dùng cho pull-to-refresh; tách biệt với initialLoading.
 * - `onLoadMore`: có guard chống double-call.
 */
export function usePagedList<T>(
  fetchFn: (page: number) => Promise<PagedResult<T>>,
  opts?: Options<T>,
) {
  const pageSize = opts?.pageSize ?? 16;
  const enabled = opts?.enabled !== false;

  /** Tránh inline getKey ở call-site (mỗi render là hàm mới) làm applyPage đổi → useEffect lặp vô hạn. */
  const getKeyRef = useRef(opts?.getKey);
  getKeyRef.current = opts?.getKey;

  const [items, setItems] = useState<T[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const genRef = useRef(0);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  hasMoreRef.current = hasMore;
  const loadingGuardRef = useRef(false);

  const applyPage = useCallback(
    (pageNum: number, result: PagedResult<T>, append: boolean) => {
      const getKey = getKeyRef.current;
      const content = result.content ?? [];
      const te = result.totalElements ?? 0;
      let tp = result.totalPages ?? 0;
      const sz = result.size ?? pageSize;

      setTotalElements(te);
      setItems((prev) => {
        if (!append) return content;
        if (getKey) {
          const seen = new Set(prev.map(getKey));
          return [...prev, ...content.filter((i) => !seen.has(getKey(i)))];
        }
        return [...prev, ...content];
      });
      pageRef.current = pageNum;

      if (tp <= 0 && te > 0) tp = Math.max(1, Math.ceil(te / Math.max(sz, 1)));
      if (tp <= 0) tp = content.length >= pageSize ? pageNum + 2 : pageNum + 1;

      const more = pageNum + 1 < tp;
      hasMoreRef.current = more;
      setHasMore(more);
    },
    [pageSize],
  );

  // Khi fetchFn thay đổi (deps thay đổi) hoặc enabled bật: reset về trang 0 và fetch lại
  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setTotalElements(0);
      setInitialLoading(false);
      return;
    }

    genRef.current += 1;
    const gen = genRef.current;
    pageRef.current = 0;
    hasMoreRef.current = true;
    setHasMore(true);
    setItems([]);
    setInitialLoading(true);

    fetchFn(0)
      .then((result) => {
        if (gen !== genRef.current) return;
        applyPage(0, result, false);
      })
      .catch(() => {
        if (gen !== genRef.current) return;
        setItems([]);
        setHasMore(false);
        hasMoreRef.current = false;
      })
      .finally(() => {
        if (gen === genRef.current) setInitialLoading(false);
      });
  }, [fetchFn, applyPage, enabled]);

  const onRefresh = useCallback(async () => {
    if (!enabled) return;
    // Nếu đang còn initialLoading (hiếm gặp), clear ngay để tránh kẹt spinner
    setInitialLoading(false);
    setRefreshing(true);
    genRef.current += 1;
    const gen = genRef.current;
    pageRef.current = 0;
    try {
      const result = await fetchFn(0);
      if (gen !== genRef.current) return;
      applyPage(0, result, false);
    } catch {
      /* silent */
    } finally {
      setRefreshing(false);
    }
  }, [fetchFn, applyPage, enabled]);

  const onLoadMore = useCallback(async () => {
    if (
      loadingGuardRef.current ||
      !hasMoreRef.current ||
      refreshing ||
      initialLoading ||
      !enabled
    )
      return;
    loadingGuardRef.current = true;
    setLoadingMore(true);
    const gen = genRef.current;
    const nextPage = pageRef.current + 1;
    try {
      const result = await fetchFn(nextPage);
      if (gen !== genRef.current) return;
      applyPage(nextPage, result, true);
    } catch {
      /* silent */
    } finally {
      loadingGuardRef.current = false;
      setLoadingMore(false);
    }
  }, [fetchFn, applyPage, refreshing, initialLoading, enabled]);

  return {
    items,
    totalElements,
    hasMore,
    initialLoading,
    loadingMore,
    refreshing,
    onRefresh,
    onLoadMore,
  };
}
