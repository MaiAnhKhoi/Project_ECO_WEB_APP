"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code"; // <<< thêm thư viện QR

export interface PayOSPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;

  orderId: number | null;

  checkoutUrl?: string | null;
  qrContent?: string | null;
  expiresAt?: string | null;

  onCheckPaid: (orderId: number) => Promise<{
    paymentStatus: string;
    orderStatus: string;
  }>;

  onGoToOrders: () => void;
}

export default function PayOSPaymentModal({
  isOpen,
  onClose,
  orderId,
  checkoutUrl,
  qrContent,
  expiresAt,
  onCheckPaid,
  onGoToOrders,
}: PayOSPaymentModalProps) {
  const [remainingSec, setRemainingSec] = useState(0);
  const [checkMessage, setCheckMessage] = useState("");
  const [checking, setChecking] = useState(false);

  // -----------------------------
  //  Countdown
  // -----------------------------
  useEffect(() => {
    if (!isOpen || !expiresAt) {
      setRemainingSec(0);
      return;
    }

    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      const sec = Math.max(0, Math.floor(diff / 1000));
      setRemainingSec(sec);
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [isOpen, expiresAt]);

  const formatRemain = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const expired = remainingSec === 0;

  // -----------------------------
  //  Auto-check mỗi 10 giây
  // -----------------------------
  useEffect(() => {
    if (!isOpen || !orderId || expired) return;

    const interval = setInterval(() => {
      handleCheckPayment(false); // FALSE = check im lặng
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, orderId, expired]);

  // -----------------------------
  //  Kiểm tra thanh toán
  // -----------------------------
  const handleCheckPayment = async (showMessage = true) => {
    if (!orderId) return;

    try {
      setChecking(true);
      if (showMessage) setCheckMessage("");

      const res = await onCheckPaid(orderId);

      if (res.paymentStatus === "paid") {
        setCheckMessage("Thanh toán thành công! Đang chuyển hướng...");

        setTimeout(() => {
          window.location.href = `/order-success?orderId=${orderId}`;
        }, 800);

        return;
      }

      if (res.paymentStatus === "expired") {
        setCheckMessage("Đơn hàng đã hết hạn thanh toán.");
        setTimeout(() => onGoToOrders(), 800);
        return;
      }

      if (showMessage) {
        setCheckMessage("Hệ thống chưa ghi nhận thanh toán, vui lòng thử lại.");
      }
    } catch (err) {
      if (showMessage) setCheckMessage("Không thể kiểm tra trạng thái thanh toán.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <div
        className={`modal fade modal-payos ${isOpen ? "show d-block" : ""}`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Thanh toán PayOS</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onGoToOrders}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {expired ? (
                <div className="alert alert-warning">
                  Đã hết hạn thanh toán. Vui lòng tạo lại đơn hàng.
                </div>
              ) : (
                <>
                  <p className="text-sm mb-2">Thời gian còn lại:</p>
                  <div className="text-center mb-3">
                    <span className="badge bg-dark px-3 py-2">
                      {formatRemain(remainingSec)}
                    </span>
                  </div>

                  {/* QR chính hãng */}
                  <div className="d-flex justify-content-center mb-3">
                    {qrContent ? (
                      <QRCode
                        value={qrContent}
                        size={210}
                        style={{ height: "210px", width: "210px" }}
                      />
                    ) : (
                      <p className="text-muted">Không có mã QR</p>
                    )}
                  </div>

                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      className="btn btn-dark2 w-100 mb-3"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mở trang thanh toán PayOS
                    </a>
                  )}

                  <p className="text-xs text-muted">
                    Sau khi chuyển khoản, hãy bấm{" "}
                    <strong>"Tôi đã thanh toán xong"</strong>.
                  </p>
                </>
              )}

              {checkMessage && (
                <div className="alert alert-info mt-3">{checkMessage}</div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              {!expired && (
                <button
                  className="btn btn-dark2"
                  disabled={checking}
                  onClick={() => handleCheckPayment(true)}
                >
                  {checking ? "Đang kiểm tra..." : "Tôi đã thanh toán xong"}
                </button>
              )}
              <button className="btn btn-secondary" onClick={onGoToOrders}>
                Đóng / Xem đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
