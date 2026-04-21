import type { Product } from "./product";

// Filter reducer types
export interface FilterState {
  price: number[];
  availability: string;
  color: string;
  size: string;
  /** Tên brand đang chọn (hoặc mảng tên) để hiển thị chip; khi call API sẽ map sang id */
  brands: string | string[];
  filtered: Product[];
  sortingOption: string;
  sorted: Product[];
  currentPage: number;
  itemPerPage: number;
  activeFilterOnSale?: boolean;
}

export type FilterAction =
  | { type: "SET_PRICE"; payload: number[] }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_SIZE"; payload: string }
  | { type: "SET_AVAILABILITY"; payload: string | boolean }
  | { type: "SET_BRANDS"; payload: string | string[] }
  | { type: "SET_FILTERED"; payload: Product[] }
  | { type: "SET_SORTING_OPTION"; payload: string }
  | { type: "SET_SORTED"; payload: Product[] }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "TOGGLE_FILTER_ON_SALE" }
  | { type: "SET_ITEM_PER_PAGE"; payload: number }
  | { type: "CLEAR_FILTER" };

export interface FilterResponse {
  price: {
    min: number;
    max: number;
  };
  availability: {
    inStock: number;
    outOfStock: number;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
    count: number;
  }[];
  colors: {
    id: number;
    name: string;
    count: number;
    cssClass?: string | null;
    hex?: string | null;
  }[];
  sizes: {
    size: string;
    count: number;
  }[];
  brands: {
    id: number;
    name: string;
    count: number;
  }[];
}
