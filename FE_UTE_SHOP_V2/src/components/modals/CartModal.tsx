"use client";

import { useContextElement } from "@/context/Context";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import QuantitySelect from "../common/QuantitySelect";
import { formatPrice } from "@/utils/formatPrice";

export default function CartModal() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const {
    cartProducts,
    updateQuantity,
    removeItemFromCart,
    changeCartItemVariant,
  } = useContextElement();

  // ✅ Tự tính tổng tiền từ cartProducts
  const cartTotal = useMemo(() => {
    if (!cartProducts || cartProducts.length === 0) return 0;

    return cartProducts.reduce((sum, item) => {
      // ưu tiên dùng giá đã giảm nếu BE có trả về
      const unitPrice =
        (item as any).discountedPrice != null
          ? Number((item as any).discountedPrice)
          : Number(item.price || 0);

      return sum + unitPrice * (item.quantity || 0);
    }, 0);
  }, [cartProducts]);

  const handleRemove = (itemId: number) => {
    removeItemFromCart(itemId);
  };

  const handleUpdateQty = (itemId: number, qty: number) => {
    updateQuantity(itemId, qty);
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style-1 popup-shopping-cart"
      id="shoppingCart"
    >
      <div className="canvas-wrapper">
        <div className="popup-header mb-4">
          <span className="title">Giỏ hàng</span>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
          />
        </div>

        <div className="wrap">
          <div className="tf-mini-cart-wrap">
            <div className="tf-mini-cart-main">
              <div className="tf-mini-cart-sroll">
                {cartProducts && cartProducts.length ? (
                  <div className="tf-mini-cart-items">
                    {cartProducts.map((item) => {
                      const unitPrice =
                        (item as any).discountedPrice != null
                          ? Number((item as any).discountedPrice)
                          : Number(item.price || 0);
                      const lineTotal = unitPrice * (item.quantity || 0);

                      return (
                        <div
                          key={item.id}
                          className="tf-mini-cart-item file-delete"
                        >
                          <div className="tf-mini-cart-image">
                            <Link to={`/product-detail/${item.productId}`}>
                              <img
                                className="lazyload"
                                alt={item.productName}
                                src={item.imgSrc}
                                width={190}
                                height={252}
                              />
                            </Link>
                          </div>

                          <div className="tf-mini-cart-info">
                            <div className="d-flex justify-content-between">
                              <Link
                                className="title link text-md fw-medium"
                                to={`/product-detail/${item.productId}`}
                              >
                                {item.productName}
                              </Link>
                              <i
                                className="icon icon-close remove fs-12"
                                onClick={() => handleRemove(item.id)}
                              />
                            </div>

                            {/* 🔽 Nếu có variantOptions -> dùng làm dropdown */}
                            {item.variantOptions && 
                             Array.isArray(item.variantOptions) && 
                             item.variantOptions.length > 0 ? (
                              <div className="mb-2">
                                <div
                                  className="cart-variant-dropdown"
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="cart-variant-toggle"
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      padding: 0,
                                      fontSize: 13,
                                      fontWeight: 600,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      cursor: "pointer",
                                      color: "#111",
                                    }}
                                    onClick={() =>
                                      setOpenDropdownId(
                                        openDropdownId === item.id ? null : item.id
                                      )
                                    }
                                  >
                                    {(item.color || "Không màu") +
                                      (item.size ? ` / ${item.size}` : "")}
                                    <span
                                      style={{
                                        fontSize: 10,
                                        marginLeft: 4,
                                        transform:
                                          openDropdownId === item.id
                                            ? "rotate(180deg)"
                                            : "none",
                                        transition: "transform 0.2s ease-in-out",
                                      }}
                                    >
                                      ▼
                                    </span>
                                  </button>

                                  {openDropdownId === item.id && (
                                    <div
                                      className="cart-variant-menu"
                                      style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        zIndex: 9999,
                                        background: "#ffffff",
                                        borderRadius: 4,
                                        marginTop: 4,
                                        minWidth: 220,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        padding: "4px 0",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      {item.variantOptions.map((opt) => (
                                        <button
                                          key={opt.variantId}
                                          type="button"
                                          className="cart-variant-item"
                                          style={{
                                            width: "100%",
                                            padding: "6px 10px",
                                            border: "none",
                                            background: "transparent",
                                            textAlign: "left",
                                            fontSize: 13,
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            color: "#111",
                                          }}
                                          onClick={() => {
                                            // ✅ dùng context: guest -> local, login -> BE
                                            changeCartItemVariant(item.id, opt);
                                            setOpenDropdownId(null);
                                          }}
                                        >
                                          {(opt.color || "Không màu") +
                                            (opt.size ? ` / ${opt.size}` : "") +
                                            " - " +
                                            formatPrice(Number(opt.price))}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              // ❗ Không có variantOptions -> chỉ hiển thị text
                              <div className="d-flex gap-10 text-xs mb-1">
                                {item.color || item.size ? (
                                  <div>
                                    {item.color ?? ""}{" "}
                                    {item.color && item.size ? "/" : ""}
                                    {item.size ?? ""}
                                  </div>
                                ) : null}
                              </div>
                            )}

                            <p className="price-wrap text-sm fw-medium">
                              <span className="new-price text-primary">
                                {formatPrice(lineTotal)}
                              </span>
                            </p>

                            <QuantitySelect
                              styleClass="small"
                              quantity={item.quantity}
                              max={item.maxQuantity ?? 0}
                              setQuantity={(qty) => handleUpdateQty(item.id, qty)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4">
                    Giỏ hàng của bạn đang trống.
                    <Link
                      className="tf-btn btn-dark2 animate-btn mt-3"
                      to="/shop-default"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="tf-mini-cart-bottom">
              <div className="tf-mini-cart-bottom-wrap">
                <div className="tf-cart-totals-discounts">
                  <div className="tf-cart-total text-xl fw-medium">
                    Tổng cộng:
                  </div>
                  <div className="tf-totals-total-value text-xl fw-medium">
                    {formatPrice(cartTotal)}
                  </div>
                </div>

                <div className="tf-mini-cart-view-checkout">
                  <Link
                    to={`/view-cart`}
                    className="tf-btn animate-btn d-inline-flex bg-dark-2 w-100 justify-content-center"
                  >
                    Xem giỏ hàng
                  </Link>

                  <Link
                    to={`/checkout`}
                    className="tf-btn btn-out-line-dark2 w-100 justify-content-center"
                  >
                    <span>Thanh toán</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
