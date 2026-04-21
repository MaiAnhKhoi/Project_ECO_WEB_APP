// src/type/order.ts

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface OrderSummary {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string; // ISO string

  // ✅ phương thức thanh toán: "COD" | "PAYOS" | ...
  paymentMethod?: string;
}

export interface OrderPage {
  content: OrderSummary[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface OrderAddress {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  city: string;
  province: string;
  region: string;
  company?: string | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  variantId?: number | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;

  productName?: string;
  imageUrl?: string;
  color?: string | null;
  size?: string | null;
}

export interface OrderDetail {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingFee: number;
  grandTotal: number;
  note?: string | null;
  createdAt: string;
  paymentExpiresAt?: string | null;
  shippingStatus?: string | null;
  cancelReason?: string | null;

  // ✅ phương thức thanh toán chi tiết
  paymentMethod?: string;

  shippingAddress?: OrderAddress | null;
  items: OrderItem[];

  // thêm info người đặt (do mình đã set ở BE)
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  // ===== REFUND INFO =====
  refundBankName?: string | null;
  refundAccountNumber?: string | null;
  refundAccountHolder?: string | null;

  refundAmount?: number | null;
  refundCode?: string | null;
  refundReason?: string | null;
  refundStatus?: string | null;
  refundRequestedAt?: string | null;

  refundQrUrl?: string | null;

  // PayOS (nếu có)
  payosCheckoutUrl?: string | null;
  payosQrUrl?: string | null;
}

export interface AdminUpdateOrderStatusRequest {
  status: string; // PENDING / CONFIRMED / PROCESSING / COMPLETED
  note?: string;
}

export interface AdminUpdateShippingStatusRequest {
  shippingStatus: string; // unfulfilled / shipping / delivered
}
