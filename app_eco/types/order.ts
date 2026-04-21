// ────────── Order status ──────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "cancel_requested";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "failed"
  | "expired"
  | "refund_info_required";

// ────────── Sub-types ──────────

export type ShippingAddress = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  city: string;
  province: string;
  region: string;
  company?: string;
};

export type OrderItemDetail = {
  id: number;
  productId: number;
  variantId?: number | null;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  /** Biến thể hiển thị (màu / size) nếu có */
  variantLabel?: string | null;
};

// ────────── Order list summary ──────────

export type OrderSummary = {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  grandTotal: number;
  createdAt: string;
  /** Hết hạn thanh toán PayOS (ISO) — từ GET /orders */
  paymentExpiresAt?: string | null;
  cancelReason?: string | null;
  /** Số lượng sản phẩm (nếu BE trả) */
  itemCount?: number;
};

export type OrderSummaryPage = {
  content: OrderSummary[];
  totalElements: number;
  totalPages: number;
  /** Index trang hiện tại (0-based) */
  number?: number;
};

// ────────── Order detail ──────────

export type OrderDetail = {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
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
  shippingAddress: ShippingAddress;
  items: OrderItemDetail[];
};

// ────────── Cancel request ──────────

export type CancelOrderRequest = {
  reason: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
};

// ────────── Status helpers ──────────

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  canceled: "Đã hủy",
  cancel_requested: "Yêu cầu hủy",
  refunded: "Đã hoàn tiền",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
  expired: "Hết hạn thanh toán",
  refund_info_required: "Cần thông tin hoàn tiền",
  refunded: "Đã hoàn tiền",
  refunding: "Đang hoàn tiền",
  partially_refunded: "Hoàn tiền một phần",
  canceled: "Đã hủy",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_COLOR: Record<
  string,
  { bg: string; text: string }
> = {
  pending: { bg: "#FEF3C7", text: "#D97706" },
  processing: { bg: "#DBEAFE", text: "#2563EB" },
  completed: { bg: "#D1FAE5", text: "#059669" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
  canceled: { bg: "#FEE2E2", text: "#DC2626" },
  cancel_requested: { bg: "#FEE2E2", text: "#DC2626" },
  refunded: { bg: "#E0E7FF", text: "#4338CA" },
};

export const PAYMENT_STATUS_COLOR: Record<
  string,
  { bg: string; text: string }
> = {
  unpaid: { bg: "#FEF3C7", text: "#D97706" },
  paid: { bg: "#D1FAE5", text: "#059669" },
  failed: { bg: "#FEE2E2", text: "#DC2626" },
  expired: { bg: "#F3F4F6", text: "#6B7280" },
  refund_info_required: { bg: "#EDE9FE", text: "#7C3AED" },
  refunded: { bg: "#E0E7FF", text: "#4338CA" },
  refunding: { bg: "#DBEAFE", text: "#2563EB" },
  partially_refunded: { bg: "#E0E7FF", text: "#4338CA" },
  canceled: { bg: "#FEE2E2", text: "#DC2626" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

/** Trạng thái vận chuyển (mã từ BE — chuẩn hóa qua normalizeOrderStatusKey) */
export const SHIPPING_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý vận chuyển",
  processing: "Đang xử lý",
  not_shipped: "Chưa gửi hàng",
  awaiting_shipment: "Chờ gửi hàng",
  awaiting_pickup: "Chờ lấy hàng",
  ready_to_ship: "Sẵn sàng gửi hàng",
  packed: "Đã đóng gói",
  picked_up: "Đã lấy hàng",
  shipped: "Đã gửi hàng",
  shipping: "Đang vận chuyển",
  in_transit: "Đang vận chuyển",
  on_the_way: "Đang trên đường giao",
  out_for_delivery: "Đang giao hàng",
  delivering: "Đang giao hàng",
  delivered: "Đã giao hàng",
  delivery_failed: "Giao hàng không thành công",
  failed: "Giao hàng không thành công",
  returned: "Hoàn trả hàng",
  cancelled: "Đã hủy vận chuyển",
  canceled: "Đã hủy vận chuyển",
  completed: "Hoàn tất giao hàng",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  PAYOS: "Chuyển khoản",
  cod: "Thanh toán khi nhận hàng",
  payos: "Chuyển khoản",
};

/** Nhãn hiển thị hình thức thanh toán (thuần Việt), không lộ mã API */
export function getPaymentMethodLabel(
  paymentMethod?: string | null,
): string | null {
  if (!paymentMethod?.trim()) return null;
  const k = paymentMethod.trim();
  return (
    PAYMENT_METHOD_LABEL[k] ??
    PAYMENT_METHOD_LABEL[k.toUpperCase()] ??
    PAYMENT_METHOD_LABEL[k.toLowerCase()] ??
    null
  );
}

/** Tab bộ lọc trạng thái đơn */
export type OrderTabKey =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export const ORDER_TABS: { key: OrderTabKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

// ────────── Checkout ──────────

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

export interface PayOSStatusResponse {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  paymentExpiresAt?: string | null;
  canRePay?: boolean;
  payosCheckoutUrl?: string | null;
  payosQrUrl?: string | null;
}

// ────────── Rule helpers ──────────

/** Chuẩn hóa mã trạng thái từ API (vd. PENDING, cancel-requested, In Transit) để tra nhãn tiếng Việt */
export function normalizeOrderStatusKey(status: string): string {
  return (status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

export function getOrderStatusDisplayLabel(
  status: string | null | undefined,
): string {
  if (!status?.trim()) return "—";
  const norm = normalizeOrderStatusKey(status);
  return ORDER_STATUS_LABEL[norm] ?? "Không xác định";
}

export function getPaymentStatusDisplayLabel(
  status: string | null | undefined,
): string {
  if (!status?.trim()) return "—";
  const norm = normalizeOrderStatusKey(status);
  return PAYMENT_STATUS_LABEL[norm] ?? "Không xác định";
}

export function getShippingStatusDisplayLabel(
  status: string | null | undefined,
): string {
  if (!status?.trim()) return "—";
  const norm = normalizeOrderStatusKey(status);
  return SHIPPING_STATUS_LABEL[norm] ?? "Không xác định";
}

/**
 * Hiện nút Thanh toán lại PayOS: pending + unpaid|failed + PAYOS.
 * Nếu có paymentExpiresAt và parse được → chỉ hiện khi còn hạn; nếu BE không gửi hạn thì vẫn hiện (API sẽ chặn khi hết hạn).
 */
export function canShowPayOSRetryPay(o: {
  paymentMethod?: string;
  paymentStatus: string;
  status: string;
  paymentExpiresAt?: string | null;
}): boolean {
  const pm = o.paymentMethod?.toUpperCase() ?? "";
  /** BE đôi khi không gửi paymentMethod ở list; có paymentExpiresAt + pending/unpaid thường là luồng PayOS */
  const looksPayOS = pm === "PAYOS" || (pm === "" && Boolean(o.paymentExpiresAt?.trim()));
  if (!looksPayOS) return false;
  const ps = o.paymentStatus?.toLowerCase() ?? "";
  if (ps !== "unpaid" && ps !== "failed") return false;
  if (o.status?.toLowerCase() !== "pending") return false;
  const exp = o.paymentExpiresAt?.trim();
  if (!exp) return true;
  const t = new Date(exp).getTime();
  if (!Number.isFinite(t)) return true;
  return t > Date.now();
}

/** Có thể hủy đơn (chưa thanh toán / COD pending) */
export function canCancelOrder(o: OrderSummary): boolean {
  return o.paymentStatus !== "paid" && o.status === "pending";
}

/** Đang yêu cầu hủy và cần thông tin hoàn tiền */
export function needsRefundInfo(o: OrderSummary): boolean {
  return (
    o.status?.toLowerCase() === "cancel_requested" &&
    o.paymentStatus?.toLowerCase() === "refund_info_required"
  );
}
