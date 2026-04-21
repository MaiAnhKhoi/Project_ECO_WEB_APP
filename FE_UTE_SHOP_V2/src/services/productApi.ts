import api from "@/config/api";
import { Product, ProductTabsResponse } from "@/types/product";
import { PageResponse } from "@/types/product";

const productApi = {
  getAll(page: number, size: number) {
    return api.get<PageResponse<any>>("/products", {
      params: { page, size },
    });
  },

  // =====================================================
  // ⭐ FILTERED PRODUCTS
  // =====================================================
  getFiltered(
    page: number,
    size: number,
    filters?: {
      price?: number[];
      availability?: boolean | "All";
      color?: string;
      size?: string;
      /** Slug category (từ query ?category=) */
      categories?: string | undefined;
      /** Một brandId dạng string để BE convert -> Long */
      brandIds?: string | undefined;
      sortingOption?: string;
    },
  ) {
    const {
      price,
      availability,
      color,
      size: sizeFilter,
      categories,
      brandIds,
      sortingOption,
    } = filters || {};

    let sortBy: string | undefined;
    let sortDir: string | undefined;

    // Đồng bộ với UI: dùng text tiếng Việt
    if (sortingOption === "Giá tăng dần") {
      sortBy = "basePrice";
      sortDir = "asc";
    } else if (sortingOption === "Giá giảm dần") {
      sortBy = "basePrice";
      sortDir = "desc";
    } else if (sortingOption === "Tên tăng dần") {
      sortBy = "name";
      sortDir = "asc";
    } else if (sortingOption === "Tên giảm dần") {
      sortBy = "name";
      sortDir = "desc";
    }

    const isDefaultPrice =
      !price || (price[0] === 0 && price[1] === 100000000);

    return api.get<PageResponse<any>>("/products/filter", {
      params: {
        page,
        size,
        minPrice: !isDefaultPrice ? price?.[0] : undefined,
        maxPrice: !isDefaultPrice ? price?.[1] : undefined,
        categories,
        colors: color !== "All" ? color : undefined,
        sizes: sizeFilter !== "All" ? sizeFilter : undefined,
        inStock: availability === "All" ? undefined : availability,
        // gửi đúng brandIds (id) cho BE
        brandIds,
        sortBy,
        sortDir,
      },
    });
  },

  // =====================================================
  // ⭐ ADD SEARCH API HERE
  // =====================================================

  /** 🔍 BASIC SEARCH */
  searchProducts(keyword: string, page: number = 0, size: number = 16, sortBy: string = "relevance") {
    return api.get<PageResponse<any>>("/products/search", {
      params: { keyword, page, size, sortBy },
    });
  },

  /** 🔍 ADVANCED SEARCH */
  searchProductsAdvanced(
    page: number,
    size: number,
    params: {
      keyword: string;
      minPrice?: number;
      maxPrice?: number;
      brandIds?: number[];
      colors?: string[];
      sizes?: string[];
      inStock?: boolean;
      sortBy?: string;
    }
  ) {
    return api.get<PageResponse<any>>("/products/search/advanced", {
      params: {
        page,
        size,
        ...params,
      },
    });
  },

  // =====================================================
  // ⭐ OTHER API (PRODUCT DETAILS + LISTS)
  // =====================================================

  getProductDetail(id: number) {
    return api.get<Product>(`/products/${id}`);
  },

  incrementViewCount(id: number) {
    return api.post(`/products/${id}/view`);
  },

  getProductTabs(id: number) {
    return api.get<ProductTabsResponse>(`/products/${id}/details`);
  },

  getFeaturedProducts(limit: number = 12) {
    return api.get<Product[]>(`/products/featured?limit=${limit}`);
  },

  getBestSellers(limit: number = 10) {
    return api.get<Product[]>("/products/best-sellers", { params: { limit } });
  },

  getNewArrivals(limit: number = 10) {
    return api.get<Product[]>("/products/new-arrivals", { params: { limit } });
  },

  getMostPopular(limit: number = 10) {
    return api.get<Product[]>("/products/most-popular", { params: { limit } });
  },

  getBestDeals(limit: number = 10) {
    return api.get<Product[]>("/products/best-deals", { params: { limit } });
  },

  getTodayPicks(limit: number = 10) {
    return api.get<Product[]>("/products/todays-picks", { params: { limit } });
  },

  getProductsByCategory(slug: string, limit: number = 20) {
    return api.get<Product[]>("/products/by-category", {
      params: { slug, limit },
    });
  },
};

export default productApi;
