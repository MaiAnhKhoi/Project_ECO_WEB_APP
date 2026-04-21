// // Product types
// export interface ProductColor {
//   label: string;
//   value: string;
//   img: string;
// }

// Alternative color format (with title instead of label)

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
export interface Product {
  id: number;
  imgSrc: string;
  imgHover?: string;
  width?: number;
  height?: number;
  saleLabel?: string | null;
  title: string;
  price: number;
  oldPrice?: number | null;
  filterSizes?: (string | undefined)[];
  filterBrands?: string[];
  filterColor?: string[];
  sizes?: string[];
  colors?: ProductColor[];
  inStock?: boolean;
  isTrending?: boolean;
  isOutofSale?: boolean;
  quantity?: number;
  countdownTimer?: any;
  [key: string]: any; // For additional properties
}
export interface ProductColor {
  label: string;
  value?: string | null; // ví dụ: bg-white
  img?: string | null;
  colorHex?: string | null;
  colorCssClass?: string | null;
  hex?: string | null; // fallback cho BE cũ
  sizes?: {
    size: string;
    inStock: boolean;
    variantId: number;
    stockQuantity: number;
  }[];
}

export interface ProductTabsResponse {
  productId: number;
  description: {
    productId: number;
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
  materials: {
    productId: number;
    title: string;
    items: string[];
  };
  additionalInfo: {
    label: string;
    value: string;
  }[];
  reviews: {
    productId: number;
    summary: {
      averageRating: number;
      totalReviews: number;
      breakdown: {
        rating: number; // 5..1
        count: number;
      }[];
    };
    reviews: {
      id: number;
      name: string;
      date: string;
      avatar?: string; // backend hiện chưa trả avatar, để optional
      rating: number;
      comment: string;
    }[];
  };
}