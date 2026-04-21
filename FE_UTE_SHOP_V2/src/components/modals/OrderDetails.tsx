// src/components/modals/OrderDetails.tsx
"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderApi from "@/services/orderApi";
import type { OrderDetail } from "@/types/order";
import { formatPrice } from "@/utils/formatPrice";

type OrderDetailsProps = {
  orderId: number | null;
};

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await orderApi.getOrderById(orderId);
      setOrder(res.data);
    } catch (e) {
      setError("Không tải được chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const itemsCount = order?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div
      className="modal fade modalCentered modal-order-detail"
      id="order_detail"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="heading">Order Detail</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>

          {/* Info trên đầu */}
          {loading && (
            <div className="py-3 text-center">Đang tải chi tiết đơn...</div>
          )}

          {error && (
            <div className="py-3 text-center text-danger">{error}</div>
          )}

          {!loading && !error && order && (
            <>
              <ul className="list-infor">
                <li>{order.orderCode}</li>
                <li>{formatDate(order.createdAt)}</li>
                <li>{itemsCount} items</li>
                <li className="text-delivered">{order.status}</li>
              </ul>

              <div className="tb-order-detail">
                <div className="top">
                  <div className="title item">Product</div>
                  <div className="title item d-md-block d-none">Quantity</div>
                  <div className="title item d-md-block d-none">Price</div>
                  <div className="title item d-md-block d-none">Total</div>
                </div>
                <div className="tb-content">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-detail-item">
                      <div className="item">
                        <div className="infor-content">
                          <div className="image">
                            {/* Nếu có route product-detail */}
                            <Link to={`/product-detail/${item.productId}`}>
                              <img
                                className="lazyload"
                                alt={item.productName}
                                src={item.imageUrl}
                                width={684}
                                height={972}
                              />
                            </Link>
                          </div>
                          <div>
                            <Link
                              className="link"
                              to={`/product-detail/${item.productId}`}
                            >
                              {item.productName}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="item" data-title="Quantity">
                        {item.quantity}
                      </div>
                      <div className="item" data-title="Price">
                        {formatPrice(item.unitPrice)}
                      </div>
                      <div className="item" data-title="Total">
                        {formatPrice(item.lineTotal)}
                      </div>
                    </div>
                  ))}

                  {/* Subtotal / tổng tiền */}
                  <div className="order-detail-item subtotal">
                    <div className="item d-md-block d-none" />
                    <div className="item d-md-block d-none" />
                    <div className="item subtotal-text">Subtotal:</div>
                    <div className="item subtotal-price">
                      {formatPrice(order.subtotal)}
                    </div>
                  </div>
                  <div className="order-detail-item subtotal">
                    <div className="item d-md-block d-none" />
                    <div className="item d-md-block d-none" />
                    <div className="item subtotal-text">Shipping:</div>
                    <div className="item subtotal-price">
                      {formatPrice(order.shippingFee)}
                    </div>
                  </div>
                  <div className="order-detail-item subtotal">
                    <div className="item d-md-block d-none" />
                    <div className="item d-md-block d-none" />
                    <div className="item subtotal-text fw-medium">
                      Grand Total:
                    </div>
                    <div className="item subtotal-price fw-medium">
                      {formatPrice(order.grandTotal)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom text-center">
                Not happy with the order? You can
                <Link
                  to={`/return-and-refund`}
                  className="fw-medium btn-underline"
                >
                  Request a free return
                </Link>
                in <span className="fw-medium">14 days</span>
              </div>
            </>
          )}

          {/* Trường hợp chưa chọn đơn nào nhưng mở modal
          {!loading && !error && !order && (
            <div className="py-4 text-center">
              Không có đơn hàng để hiển thị.
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
