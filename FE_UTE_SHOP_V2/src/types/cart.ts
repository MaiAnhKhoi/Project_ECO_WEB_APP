export interface CartItem {
  /** id của CartItem trên BE */
  id: number;

  /** id sản phẩm gốc */
  productId: number;

  /** slug sản phẩm (dùng để link /product-detail/:slug nếu cần) */
  productSlug: string;

  /** tên sản phẩm */
  productName: string;   // 👈 đổi cho đúng với BE
  // nếu bạn thích dùng title ở UI thì có thể map: const title = item.productName

  /** id variant (màu + size) nếu có */
  variantId: number | null;

  /** màu (lấy từ thuộc tính variant) */
  color: string | null;

  /** size (lấy từ thuộc tính variant) */
  size: string | null;

  /** ảnh theo màu/variant */
  imgSrc: string;

  /** số lượng hiện tại trong giỏ */
  quantity: number;

  /** giá 1 sản phẩm (đã chốt theo variant) */
  price: number;

  /** số lượng tối đa cho phép (theo stock) */
  maxQuantity: number;

  /** danh sách các biến thể để đổi trong giỏ */
  variantOptions: CartVariantOptionResponse[];
}

export interface CartResponse {
  id: number;          // 👈 trùng với BE
  totalPrice: number;  // BigDecimal -> number
  items: CartItem[];
}

export interface CartVariantOptionResponse {
  variantId: number;          // 👈 trùng BE
  color: string | null;
  size: string | null;
  price: number;              // 👈 có trong JSON
  maxQuantity: number;
  imageUrl: string | null;    // 👈 ảnh theo từng variant
}

export type VariantOption = CartVariantOptionResponse;