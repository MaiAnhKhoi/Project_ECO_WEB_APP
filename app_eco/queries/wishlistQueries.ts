import { useQuery } from "@tanstack/react-query";

import { getProductDetail } from "@/services/productService";

export function useWishlistProductsQuery(productIds: number[]) {
  return useQuery({
    queryKey: ["wishlist", "products", productIds],
    queryFn: async () => {
      const results = await Promise.allSettled(
        productIds.map((id) => getProductDetail(id))
      );
      return results
        .filter(
          (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getProductDetail>>> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);
    },
    enabled: productIds.length > 0,
  });
}

