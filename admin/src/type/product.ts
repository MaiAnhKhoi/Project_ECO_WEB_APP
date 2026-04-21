// src/type/product.ts

// ===============================
//      GENERIC API WRAPPERS
// ===============================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  // nếu backend sau này trả thêm errorCode, statusCode... thì bổ sung vào đây
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ===============================
//           PUBLIC TYPES
// ===============================

// Card sản phẩm dùng cho client (khớp ProductCardResponse bên BE)
export interface ProductCard {
  id: number;
  title: string;
  imgSrc: string;
  imgHover?: string | null;
  width?: number | null;
  height?: number | null;
  price: number;
  oldPrice?: number | null;
  saleLabel?: string | null;
  inStock: boolean;

  // bổ sung thêm cho filter / UI nếu BE có:
  sizes?: string[];           // size hiển thị
  colors?: string[];          // màu hiển thị
  filterSizes?: string[];     // dùng cho filter
  filterColor?: string | null;
  filterBrands?: string[];    // brand slug/name cho filter
  brandName?: string | null;
}

// Chi tiết sản phẩm client (tuỳ public API của bạn)
export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description?: string | null;

  basePrice: number;
  status: string;

  brandId?: number | null;
  brandName?: string | null;

  // có thể không cần full như admin, tuỳ public API
  tags?: string | null;
  material?: string | null;
  careInstructions?: string | null;
  countryOfOrigin?: string | null;

  images: ImageDto[];
  variants: ProductVariantAdminDto[]; // tạm reuse DTO admin cho FE
}

// ===============================
//           ADMIN TYPES
// ===============================

export interface ImageDto {
  id: number;
  url: string;
  alt?: string | null;
  sortOrder?: number | null;
  primary: boolean;
  hover?: boolean | null;
}

export interface VariantAttributePairDto {
  attributeId: number;
  attributeName: string;
  attributeValueId: number;
  attributeValue: string;
}

export interface ProductVariantAdminDto {
  id: number;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  weightGram?: number | null;
  status: string;
  isDefault: boolean;

  stockQuantity: number;
  safetyStock?: number | null;
  stockLocation?: string | null;

  attributes: VariantAttributePairDto[];
  images: ImageDto[];
}

export interface ProductAdminDetailDto {
  id: number;
  brandId?: number | null;
  brandName?: string | null;

  name: string;
  slug: string;
  description?: string | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;

  tags?: string | null;
  material?: string | null;
  careInstructions?: string | null;
  countryOfOrigin?: string | null;

  featured: boolean;
  basePrice: number;
  status: string;

  viewCount?: number | null;
  soldCount?: number | null;

  createdAt: string;
  updatedAt?: string | null;

  // từ quan hệ với categories
  categoryIds: number[];
  categoryNames: string[];

  images: ImageDto[];
  variants: ProductVariantAdminDto[];
}

// Page cho admin list products
export type ProductAdminPage = PageResponse<ProductAdminDetailDto>;

// ===============================
//        SEARCH RESULT TYPES
// ===============================

// Khớp với ProductSearchResponse bên BE (searchProducts / searchProductsWithFilters)
export interface ProductSearchResult {
  id: number;
  title: string;
  imgSrc: string;
  imgHover?: string | null;
  width?: number | null;
  height?: number | null;
  price: number;
  oldPrice?: number | null;
  saleLabel?: string | null;
  inStock: boolean;

  // từ ProductCardResponse
  sizes?: string[];
  filterSizes?: string[];
  filterColor?: string | null;
  filterBrands?: string[];
  colors?: string[];

  // thông tin search
  relevanceScore: number;
  highlightedTitle?: string | null;
  matchedFields?: string[];

  // bổ sung từ BE
  brandName?: string | null;
  categoryName?: string | null;
}

export type ProductSearchPage = PageResponse<ProductSearchResult>;

// ===============================
//        RESPONSE ALIASES
// ===============================

// Cho public API
export type ProductCardListResponse = ApiResponse<ProductCard[]>;
export type ProductDetailResponse = ApiResponse<ProductDetail>;
export type ProductSearchResponse = ApiResponse<ProductSearchPage>;

// Cho admin
export type ProductAdminListResponse = ApiResponse<ProductAdminPage>;
export type ProductAdminDetailResponse = ApiResponse<ProductAdminDetailDto>;
