import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * 3 phút: đủ dài để tránh refetch không cần thiết khi user navigate
       * qua lại giữa các màn (product list, home...). Màn cần fresh data
       * (cart, profile) tự override staleTime: 0 hoặc dùng invalidateQueries.
       */
      staleTime: 3 * 60_000,
      /**
       * 15 phút: giữ cache sau khi component unmount để back về screen cũ
       * không cần fetch lại từ đầu (ví dụ: từ product detail back về shop).
       */
      gcTime: 15 * 60_000,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      /**
       * Không refetch khi mount nếu data còn trong staleTime — tránh
       * waterfall request khi chuyển tab / navigate.
       */
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
