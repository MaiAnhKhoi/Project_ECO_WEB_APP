// src/types/order.ts

export interface CheckoutRequest {
  addressId: number;
  paymentMethod: "COD" | "PAYOS";
  subtotal: number;
  discountTotal?: number;
  taxTotal?: number;
  shippingFee?: number;
  grandTotal: number;
  couponCode?: string | null;
  note?: string;
  items: {
    productId: number;
    variantId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface CheckoutResponse {
  orderId: number;
  orderCode: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  payosCheckoutUrl?: string | null;
  payosQrUrl?: string | null;
  paymentExpiresAt?: string | null;
}

export interface OrderDetail extends CheckoutResponse {
  // TODO: bổ sung theo BE trả:
  // items, address, timeline,...
  // items?: OrderItemDetail[];
  // shippingAddress?: AddressResponse;
  // ...
}

export interface OrderSummary {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string;
}

export interface OrderSummaryPage {
  content: OrderSummary[];
  totalPages: number;
  totalElements: number;
  number: number; // current page
}
export interface OrderAddressInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  zipcode?: string;
  phone?: string;
}

export interface OrderProductInfo {
  id: number;
  name: string;
  variant: string; // "White / L"
  price: number;
  quantity: number;
  image: string;
}

export interface OrderSuccessData {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  orderTotal: number;
  paymentMethod: string;

  shippingAddress: OrderAddressInfo;
  billingAddress: OrderAddressInfo;

  products: OrderProductInfo[];

  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}



// Địa chỉ giao hàng trong chi tiết đơn
export interface ShippingAddress {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  city: string;
  province: string;
  region: string;
  company: string;
}

// Item trong chi tiết đơn
export interface OrderItemDetail {
  id: number;
  productId: number;
  variantId: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  productName: string;
  imageUrl: string;
}

// Chi tiết 1 đơn hàng
export interface OrderDetail {
  orderId: number;
  orderCode: string;

  // 🔧 Để string cho trùng với khai báo cũ
  status: string;
  paymentStatus: string;

  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingFee: number;
  grandTotal: number;
  note: string;
  createdAt: string;
  paymentExpiresAt: string | null;
  shippingStatus: string;
  shippingAddress: ShippingAddress;
  items: OrderItemDetail[];
}

// 1 dòng trong list đơn
export interface OrderSummary {
  orderId: number;
  orderCode: string;

  // 🔧 Để string cho trùng với khai báo cũ
  status: string;
  paymentStatus: string;

  grandTotal: number;
  createdAt: string;
  cancelReason?: string | null; // Lý do hủy đơn (nếu admin đã hủy)
}

// Dữ liệu phân trang list đơn
export interface OrderSummaryPage {
  content: OrderSummary[];
  totalPages: number;
  totalElements: number;
  number: number;
}


export interface CancelOrderRequest {
  reason: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
}


export interface OrderStatusResponse {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;

  paymentExpiresAt?: string | null;   // 🟢 thêm
  canRePay?: boolean;                 // 🟢 thêm

  orderCode?: string;                 // (optional)
  payosCheckoutUrl?: string | null;   // dùng khi /pay => có khi /status không
  payosQrUrl?: string | null;
}