export interface CartVariantOption {
  variantId: number;
  color: string | null;
  size: string | null;
  price: number;
  maxQuantity: number;
  imageUrl: string | null;
}

export interface CartItem {
  /** id của CartItem trên server */
  id: number;
  productId: number;
  productSlug?: string;
  productName: string;
  variantId: number | null;
  color: string | null;
  size: string | null;
  imgSrc: string;
  quantity: number;
  price: number;
  maxQuantity: number;
  variantOptions?: CartVariantOption[];
}

export interface CartResponse {
  id: number;
  totalPrice: number;
  items: CartItem[];
}
