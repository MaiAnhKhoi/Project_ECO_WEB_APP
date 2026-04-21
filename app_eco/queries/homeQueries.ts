import { useQuery } from "@tanstack/react-query";

import { getHomeBanners } from "@/services/bannerService";
import { getRootCategories } from "@/services/categoryService";
import { getAllBrands } from "@/services/brandService";
import { getTestimonials } from "@/services/reviewService";
import {
  getBestDeals,
  getBestSellers,
  getMostPopular,
  getNewArrivals,
  getTodaysPicks,
} from "@/services/productService";

export function useHomeBannersQuery() {
  return useQuery({
    queryKey: ["home", "banners"],
    queryFn: getHomeBanners,
  });
}

export function useHomeMetaQuery() {
  return useQuery({
    queryKey: ["home", "meta"],
    queryFn: async () => {
      const [categories, brands, testimonials] = await Promise.all([
        getRootCategories(),
        getAllBrands(),
        getTestimonials(),
      ]);
      return { categories, brands, testimonials };
    },
  });
}

export function useHomeProductsQuery() {
  return useQuery({
    queryKey: ["home", "products"],
    queryFn: async () => {
      const [newProducts, bestSellers, bestDeals, popularProducts, todaysPicks] =
        await Promise.all([
          getNewArrivals(10),
          getBestSellers(10),
          getBestDeals(10),
          getMostPopular(10),
          getTodaysPicks(10),
        ]);
      return { newProducts, bestSellers, bestDeals, popularProducts, todaysPicks };
    },
  });
}

