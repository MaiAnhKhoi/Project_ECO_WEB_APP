import { CartItem } from "./cart";
import type { Product } from "./product";
import type { VariantOption } from "@/types/cart";

// Context types
import type { ReactNode } from "react";

export interface ContextProps {
  children: ReactNode;
}
export interface ContextValue {
  // 🛒 CART từ BE
  cartProducts: CartItem[];
  setCartProducts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  totalPrice: number;

addProductToCart(
  productId: number,
  qty?: number,
  isModal?: boolean,
  variantId?: number | null,
  color?: string | null
): void;

  // check product (và optional variant) đã trong giỏ chưa
  isAddedToCartProducts: (
    productId: number,
    variantId?: number | null
  ) => boolean;

  // update theo itemId trong cart
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItemFromCart: (itemId: number) => void;

  // 💖 WISHLIST
  wishList: number[];
  wishListLength: number;
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  isAddedtoWishlist: (id: number) => boolean;

  // 👁 QUICK VIEW
  quickViewItem: Product | undefined;
  setQuickViewItem: React.Dispatch<React.SetStateAction<Product | undefined>>;
  quickAddItem: number;
  setQuickAddItem: React.Dispatch<React.SetStateAction<number>>;

  // 🔁 COMPARE
  compareItem: number[];
  setCompareItem: React.Dispatch<React.SetStateAction<number[]>>;
  addToCompareItem: (id: number) => void;
  removeFromCompareItem: (id: number) => void;
  clearCompare: () => void;
  isAddedtoCompareItem: (id: number) => boolean;
   mergeCartAfterLogin: () => Promise<void>;
  changeCartItemVariant: (itemId: number, option: VariantOption) => void;
}
