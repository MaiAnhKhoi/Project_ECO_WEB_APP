// src/components/dashboard/Orders.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import orderApi from "@/services/orderApi";
import type {
  OrderSummaryPage,
  OrderSummary,
  CancelOrderRequest,
} from "@/types/order";
import { formatPrice } from "@/utils/formatPrice";
import PayOSPaymentModal from "../modals/PayOSPaymentModal";

// nếu dùng bootstrap global để đóng modal, có thể khai báo:
declare const bootstrap: any;

type OrdersProps = {
  onViewDetail: (orderId: number) => void;
};

export default function Orders({ onViewDetail }: OrdersProps) {
  const [data, setData] = useState<OrderSummaryPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page] = useState(0); // hiện tại lấy trang 0
  
const [payModalOpen, setPayModalOpen] = useState(false);
const [payOrderId, setPayOrderId] = useState<number | null>(null);
const [payCheckoutUrl, setPayCheckoutUrl] = useState<string | null>(null);
const [payQrContent, setPayQrContent] = useState<string | null>(null);
const [payExpiresAt, setPayExpiresAt] = useState<string | null>(null);

const [payPaymentStatus, setPayPaymentStatus] = useState<string | null>(null);
const [payOrderStatus, setPayOrderStatus] = useState<string | null>(null);



  // ⭐ state cho cancel modal
  const [orderForCancel, setOrderForCancel] = useState<OrderSummary | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState("Tôi đổi ý");
  const [bankName, setBankName] = useState("MB");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderApi.getMyOrders(page, 10);
      setData(res.data);
    } catch (e) {
      setError("Không tải được danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);


  useEffect(() => {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem("pendingPayOSPayment");
  if (!raw) return;

  try {
    const saved = JSON.parse(raw) as {
      from?: string;
      orderId: number;
      checkoutUrl: string | null;
      qrUrl: string | null;
      expiresAt: string | null;
    };

    if (!saved.orderId) {
      localStorage.removeItem("pendingPayOSPayment");
      return;
    }

    // Chỉ xử lý nếu source phù hợp (từ orders hoặc không set)
    if (saved.from !== "orders") {
      return;
    }

    // GỌI API check để chắc chắn đơn còn pending + unpaid
    (async () => {
      try {
        const res = await orderApi.checkPayOSStatus(saved.orderId);
        const { paymentStatus, orderStatus, paymentExpiresAt } = res.data;

        if (
          orderStatus === "pending" &&
          paymentStatus === "unpaid"
        ) {
          setPayOrderId(saved.orderId);
          setPayCheckoutUrl(saved.checkoutUrl);
          setPayQrContent(saved.qrUrl);
          setPayExpiresAt(paymentExpiresAt || saved.expiresAt || null);
          setPayModalOpen(true);

          setPayPaymentStatus(paymentStatus);
          setPayOrderStatus(orderStatus);
        } else {
          // nếu đã thanh toán / hết hạn / huỷ -> clear
          localStorage.removeItem("pendingPayOSPayment");
        }
      } catch {
        localStorage.removeItem("pendingPayOSPayment");
      }
    })();
  } catch {
    localStorage.removeItem("pendingPayOSPayment");
  }
}, []);
const hasLocalPayOS = (orderId: number) => {
  if (typeof window === "undefined") return false;

  const raw = localStorage.getItem("pendingPayOSPayment");
  if (!raw) return false;

  try {
    const saved = JSON.parse(raw);
    return saved.orderId === orderId && (saved.checkoutUrl || saved.qrUrl);
  } catch {
    return false;
  }
};


  const hasOrders = data && data.content.length > 0;

  const renderStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "text-delivered";
      case "processing":
        return "text-on-the-way";
      case "cancelled":
        return "text-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ====== RULE NGHIỆP VỤ ======

  // Thanh toán lại:
  // - paymentStatus: unpaid | failed
  // - status: pending (đang trong thời gian thanh toán)
  const canRetryPay = (order: OrderSummary) => {
  const unpaid = order.paymentStatus === "unpaid" || order.paymentStatus === "failed";
  const pending = order.status === "pending";

  return unpaid && pending && hasLocalPayOS(order.orderId);
};

  // Hủy đơn chưa thanh toán / COD
  // - paymentStatus !== "paid"
  // - status === "pending" (COD chưa xác nhận)
  const canCancelUnpaid = (order: OrderSummary) =>
    order.paymentStatus !== "paid" && order.status === "pending";

  // Hủy + hoàn tiền đơn đã thanh toán online
  // - paymentStatus === "paid"
  // - status: pending | processing (admin chưa xử lý xong)
  const canCancelPaid = (order: OrderSummary) =>
    order.paymentStatus === "paid" &&
    (order.status === "pending" || order.status === "processing");


  const needRefundInfo = (order: OrderSummary) =>
order.status?.toLowerCase() === "cancel_requested" &&
    order.paymentStatus?.toLowerCase() === "refund_info_required";

  // ====== ACTION ======

const handleRetryPay = async (order: OrderSummary) => {
  if (!canRetryPay(order)) return;

  try {
    // 1. Gọi BE kiểm tra trạng thái
    const res = await orderApi.retryPayWithPayOS(order.orderId);
    const { orderStatus, paymentStatus, paymentExpiresAt, canRePay } = res.data;

    if (!canRePay || orderStatus !== "pending" || paymentStatus !== "unpaid") {
      alert("Đơn hàng này hiện không thể thanh toán lại.");
      return;
    }

    // 2. Lấy lại link/QR từ localStorage (nếu đã lưu lúc checkout)
    const raw = localStorage.getItem("pendingPayOSPayment");
    if (!raw) {
      alert("Không tìm thấy thông tin thanh toán PayOS trước đó.");
      return;
    }

    let saved: {
      orderId: number;
      checkoutUrl: string | null;
      qrUrl: string | null;
      expiresAt: string | null;
    };

    try {
      saved = JSON.parse(raw);
    } catch {
      localStorage.removeItem("pendingPayOSPayment");
      alert("Dữ liệu PayOS không hợp lệ, vui lòng đặt lại đơn mới.");
      return;
    }

    if (!saved.checkoutUrl && !saved.qrUrl) {
      alert("Không tìm thấy link thanh toán PayOS.");
      return;
    }

    // 3. Mở modal với thông tin đã lưu
    setPayOrderId(order.orderId);
    setPayCheckoutUrl(saved.checkoutUrl);
    setPayQrContent(saved.qrUrl);
    setPayExpiresAt(paymentExpiresAt || saved.expiresAt || null);
    setPayModalOpen(true);

    setPayPaymentStatus(paymentStatus);
    setPayOrderStatus(orderStatus);

    // lưu lại cho lần sau
    const pendingPayos = {
      from: "orders",
      orderId: order.orderId,
      checkoutUrl: saved.checkoutUrl,
      qrUrl: saved.qrUrl,
      expiresAt: paymentExpiresAt || saved.expiresAt,
    };
    localStorage.setItem("pendingPayOSPayment", JSON.stringify(pendingPayos));
  } catch (e: any) {
    console.error("Retry PayOS error:", e?.response || e);
    alert(
      e?.response?.data?.message ||
        "Không thể thanh toán lại. Vui lòng thử lại sau."
    );
  }
};




  // Mở modal hủy đơn
  const openCancelModal = (order: OrderSummary) => {
    setOrderForCancel(order);
    setCancelError("");
    // Nếu admin đã hủy đơn, dùng lý do của admin (không cho user chỉnh sửa)
    // Nếu user tự hủy, dùng lý do mặc định
    setCancelReason(order.cancelReason || "Tôi đổi ý");
    setBankName("MB");
    setAccountNumber("");
    setAccountHolder("");
  };

  // Submit form hủy đơn trong modal
  const handleSubmitCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForCancel) return;

    const order = orderForCancel;
    setCancelError("");
    setCancelSubmitting(true);

    try {
      // Nếu admin đã hủy, dùng lý do của admin (không cho user chỉnh sửa)
      const reasonToUse = needRefundInfo(order) 
        ? (order.cancelReason || "Admin hủy đơn")
        : (cancelReason || "Tôi đổi ý");

      const basePayload: CancelOrderRequest = {
        reason: reasonToUse,
      };

      let payload: CancelOrderRequest = basePayload;

        if (canCancelPaid(order) || needRefundInfo(order)) {

        // cần bank info
        if (!bankName || !accountNumber || !accountHolder) {
          setCancelError(
            "Vui lòng nhập đầy đủ Tên ngân hàng, Số tài khoản và Chủ tài khoản."
          );
          setCancelSubmitting(false);
          return;
        }
        payload = {
          ...basePayload,
          bankName,
          accountNumber,
          accountHolder,
        };
      } else if (!canCancelUnpaid(order)) {
        setCancelError("Đơn hàng này không thể hủy.");
        setCancelSubmitting(false);
        return;
      }

      await orderApi.cancelOrder(order.orderId, payload);
      alert("Yêu cầu hủy đơn đã được gửi.");

      // reload list
      await loadOrders();

      // đóng modal
      const modalEl = document.getElementById("cancel_order");
      if (modalEl && typeof bootstrap !== "undefined") {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance && modalInstance.hide();
      }
      setOrderForCancel(null);
    } catch (e: any) {
      setCancelError(
        e?.response?.data?.message ||
          "Hủy đơn thất bại. Vui lòng thử lại."
      );
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        {/* sidebar-account */}
        <div className="btn-sidebar-mb d-lg-none">
          <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
            <i className="icon icon-sidebar" />
          </button>
        </div>
        {/* /sidebar-account */}

        <div className="main-content-account">
          <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
            <ul className="my-account-nav">
              <Sidebar />
            </ul>
          </div>

          <div className="my-acount-content account-orders">
            {/* Nếu đang loading lần đầu */}
            {loading && !hasOrders && (
              <div className="py-5 text-center">Đang tải đơn hàng...</div>
            )}

            {/* Nếu lỗi */}
            {error && (
              <div className="py-3 text-center text-danger">{error}</div>
            )}

            {/* Không có đơn nào */}
            {!loading && !hasOrders && !error && (
              <div className="account-no-orders-wrap">
                <img
                  className="lazyload"
                  data-src="/images/section/account-no-order.png"
                  alt=""
                  src="/images/section/account-no-order.png"
                  width={169}
                  height={168}
                />
                <div className="display-sm fw-medium title">
                  You haven’t placed any order yet
                </div>
                <div className="text text-sm">
                  It’s time to make your first order
                </div>
                <Link
                  to={`/shop-default`}
                  className="tf-btn animate-btn d-inline-flex bg-dark-2 justify-content-center"
                >
                  Shop Now
                </Link>
              </div>
            )}

            {/* Có đơn hàng → hiển thị bảng Order History */}
            {hasOrders && (
              <div className="account-orders-wrap">
                <h5 className="title">Order History</h5>
                <div className="wrap-account-order">
                  <table>
                    <thead>
                      <tr>
                        <th className="text-md fw-medium">Order Code</th>
                        <th className="text-md fw-medium">Date</th>
                        <th className="text-md fw-medium">Status</th>
                        <th className="text-md fw-medium">Total</th>
                        <th className="text-md fw-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data!.content.map((order: OrderSummary) => (
                        <tr key={order.orderId} className="tf-order-item">
                          <td className="text-md">{order.orderCode}</td>
                          <td className="text-md">
                            {formatDate(order.createdAt)}
                          </td>
                          <td
                            className={`text-md ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {renderStatusText(order.status)}
                          </td>
                          <td className="text-md">
                            {formatPrice(order.grandTotal)}
                          </td>
                          <td>
                            {/* Detail (modal chi tiết đơn) */}
                            <a
                              href="#order_detail"
                              data-bs-toggle="modal"
                              className="view-detail me-2"
                              onClick={() => onViewDetail(order.orderId)}
                            >
                              Detail
                            </a>

                            {/* Thanh toán lại nếu đủ điều kiện */}

                              {canRetryPay(order) && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-success me-2"
                                  onClick={() => handleRetryPay(order)}
                                >
                                  Pay again
                                </button>
                              )}

                              {/* User tự hủy đơn đã thanh toán */}
                              {canCancelPaid(order) && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#cancel_order"
                                  onClick={() => openCancelModal(order)}
                                >
                                  Cancel
                                </button>
                              )}

                              {/* Admin đã hủy → user cần cung cấp thông tin hoàn tiền */}
                              {needRefundInfo(order) && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-warning mt-2"
                                  data-bs-toggle="modal" 
                                  data-bs-target="#cancel_order"
                                  onClick={() => openCancelModal(order)}
                                >
                                  Provide refund info
                                </button>
                              )}

                              {/* Hủy đơn chưa thanh toán */}
                              {canCancelUnpaid(order) && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#cancel_order"
                                  onClick={() => openCancelModal(order)}
                                >
                                  Cancel
                                </button>
                              )}

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== MODAL HỦY ĐƠN ====== */}
<div
  className="modal fade"
  id="cancel_order"
  tabIndex={-1}
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content border-0 shadow">
      {/* Header */}
      <div className="modal-header bg-danger text-white">
        <h5 className="modal-title">Hủy đơn hàng</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>

      {/* Body */}
      <div className="modal-body">
        {orderForCancel ? (
          <>
            <div className="order-summary d-flex flex-column gap-2 mb-3">
              <div className="d-flex justify-content-between align-items-center p-2 border rounded bg-light">
                <span className="fw-bold text-secondary">Mã đơn:</span>
                <span className="fw-bold text-primary">{orderForCancel.orderCode}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 border rounded bg-light">
                <span className="fw-bold text-secondary">Tổng tiền:</span>
                <span className="fw-bold text-success">{formatPrice(orderForCancel.grandTotal)}</span>
              </div>
            </div>


            <form onSubmit={handleSubmitCancel}>
              {/* Lý do hủy */}
              <div className="mb-3">
                <label className="form-label">
                  {needRefundInfo(orderForCancel) 
                    ? "Lý do hủy đơn (Admin đã hủy)" 
                    : "Lý do hủy đơn"}
                </label>
                {needRefundInfo(orderForCancel) ? (
                  // Admin đã hủy: chỉ hiển thị lý do, không cho chỉnh sửa
                  <div className="alert alert-warning py-2">
                    <strong>Lý do admin hủy:</strong> {orderForCancel.cancelReason || "Admin hủy đơn"}
                  </div>
                ) : (
                  // User tự hủy: cho nhập lý do
                  <textarea
                    className="form-control"
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn"
                    required
                  />
                )}
              </div>

              {/* Nếu đơn đã thanh toán → form ngân hàng với logo */}
                {(canCancelPaid(orderForCancel) || needRefundInfo(orderForCancel)) && (

                <div className="mb-3">
                  <label className="form-label">Chọn ngân hàng để hoàn tiền</label>
                  <div className="bank-options d-flex flex-column gap-2">
                    {[ 
                      {
                        code: "MB",
                        name: "MB Bank",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_new.png/1200px-Logo_MB_new.png",
                      },
                      {
                        code: "Vietcombank",
                        name: "Vietcombank",
                        logo: "https://cdn2.tuoitre.vn/thumb_w/600/471584752817336320/2023/2/23/29229888323456029822604684420721366064172575n-16771238637691533081421.jpg"
                      },
                      {
                        code: "Techcombank",
                        name: "Techcombank",
                        logo: "https://cdn2.tuoitre.vn/thumb_w/1200/471584752817336320/2023/2/23/logo-tcb-h-635x212-16771405482561720908772.png"
                      },
                      {
                        code: "Sacombank",
                        name: "Sacombank",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo-Sacombank-new.png"
                      },
                      {
                        code: "TPBank",
                        name: "TPBank",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_TPBank.svg/2560px-Logo_TPBank.svg.png"
                      },
                      {
                        code: "BIDV",
                        name: "BIDV",
                        logo: "https://finance.vietstock.vn/image/BID" // nếu URL đầy đủ
                      }
                    ].map((bank) => (
                      <label
                        key={bank.code}
                        className="d-flex align-items-center border rounded p-2 bank-option"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name="bank"
                          value={bank.code}
                          checked={bankName === bank.code}
                          onChange={() => setBankName(bank.code)}
                          required
                          className="me-2"
                        />
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          style={{ width: "40px", height: "auto", marginRight: "10px" }}
                        />
                        <span>{bank.name}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="mb-2">
                      <label className="form-label">Số tài khoản</label>
                      <input
                        type="text"
                        className="form-control"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Nhập số tài khoản nhận hoàn tiền"
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Chủ tài khoản</label>
                      <input
                        type="text"
                        className="form-control"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Nhập tên chủ tài khoản"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {cancelError && (
                <div className="alert alert-danger py-2">{cancelError}</div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  disabled={cancelSubmitting}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={cancelSubmitting}
                >
                  {cancelSubmitting ? "Đang xử lý..." : "Xác nhận hủy đơn"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <p>Đã gửi yêu cầu hủy thành công</p>
        )}
      </div>
    </div>
  </div>
</div>


      {/* /Account */}
<PayOSPaymentModal
  isOpen={payModalOpen}
  onClose={() => {
    // ❌ KHÔNG xóa localStorage ở đây
    setPayModalOpen(false);
  }}
  orderId={payOrderId}
  checkoutUrl={payCheckoutUrl || undefined}
  qrContent={payQrContent || undefined}
  expiresAt={payExpiresAt || undefined}
  onCheckPaid={async (orderId) => {
    const res = await orderApi.checkPayOSStatus(orderId);
    const paymentStatus = res.data.paymentStatus;
    const orderStatus = res.data.orderStatus;

    if (
      paymentStatus === "paid" ||
      paymentStatus === "expired" ||
      orderStatus === "cancelled"
    ) {
      // ✅ chỉ lúc này mới xóa
      localStorage.removeItem("pendingPayOSPayment");
      loadOrders();
    }

    setPayPaymentStatus(paymentStatus);
    setPayOrderStatus(orderStatus);

    return { paymentStatus, orderStatus };
  }}
  onGoToOrders={() => {
    setPayModalOpen(false);
    loadOrders();
  }}
/>



    </div>

    
  );

  
}



