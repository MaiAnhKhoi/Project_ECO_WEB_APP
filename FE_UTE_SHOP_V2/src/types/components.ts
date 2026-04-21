// Component prop types
import { FilterResponse } from "./filter";
import type { Product } from "./product";

// ProductCard
export interface ProductCardProps {
  product: Product;
  styleClass?: string;
  tooltipDirection?: string;
  textCenter?: boolean;
  ratioClass?: string;
  onWishlistRemove?: (productId: number) => void;
}

// LayoutHandler
export interface LayoutHandlerProps {
  activeLayout: number;
  setActiveLayout: React.Dispatch<React.SetStateAction<number>>;
  hasSidebar?: boolean;
}

// ProductDetails
export interface DetailsProps {
  product: Product;
}

export interface BreadcumbProps {
  product?: Product;
}

export interface ColorOption {
  id: string;
  value: string;
  color: string;
  colorHex?: string; // hex color để dùng inline style nếu không có css class
}

export interface Size {
  label: string;
  value: string;
  display: string;
  inStock?: boolean;
  variantId?: number;
  stockQuantity?: number;
}

export interface ColorSelectProps {
  activeColor?: string;
  setActiveColor?: (color: string) => void;
  activeColorDefault?: string;
  colorOptions?: ColorOption[];
}

export interface ProductHeadingProps {
  showProgress?: boolean;
  inStock?: boolean;
  
}

export interface SlideItem {
  id: number;
  color: string;
  size: string;
  imgSrc: string;
}

export interface SliderProps {
  activeColor?: string;
  setActiveColor?: (color: string) => void;
  firstItem?: string;
  slideItems?: SlideItem[];
}

export interface BoughtTogetherProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  options: string[];
  checked: boolean;
}

// Products
export interface ProductsProps {
  fullWidth?: boolean;
  cardStyleClass?: string;
  tooltipDirection?: string;
  parentClass?: string;
}

export interface FilterProps {
  [key: string]: any;
}

export interface SidebarProps {
  allProps: FilterProps;
}

export interface FilterModalProps {
  allProps: any;
  filters?: FilterResponse | null;
}

export interface FilterDropdownProps {
  allProps: FilterProps;
  filters?: FilterResponse | null;
}

export interface ListProductsProps {
  products: Product[];
}

export interface GridProductsProps {
  products: Product[];
  cardStyleClass?: string;
  tooltipDirection?: string;
}

// Common
export interface QuantitySelectProps {
  quantity?: number;
    max: number;
  setQuantity?: (qty: number) => void;
  styleClass?: string;
}

