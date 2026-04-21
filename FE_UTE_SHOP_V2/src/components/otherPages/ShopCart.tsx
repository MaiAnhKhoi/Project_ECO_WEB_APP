"use client";

import { iconFeatures } from "@/data/features";
import { testimonials12 } from "@/data/testimonials";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
import QuantitySelect from "../common/QuantitySelect";
import { formatPrice } from "@/utils/formatPrice";
import cartApi from "@/services/cartApi";
import { useMemo } from "react";
import type { CartItem } from "@/types/cart";

export default function ShopCart() {
  const {
    cartProducts,
    setCartProducts,
    // totalPrice,   // ❌ bỏ, ta tự tính
    updateQuantity,
    changeCartItemVariant, // ✅ Thêm để xử lý cả Guest và Customer
  } = useContextElement();

  // ✅ Tự tính tổng tiền từ cartProducts (ưu tiên discountedPrice nếu có)
  const cartTotal = useMemo(() => {
    if (!cartProducts || cartProducts.length === 0) return 0;

    return cartProducts.reduce((sum, item) => {
      const unitPrice =
        (item as any).discountedPrice != null
          ? Number((item as any).discountedPrice)
          : Number(item.price || 0);

      return sum + unitPrice * (item.quantity || 0);
    }, 0);
  }, [cartProducts]);

  // ⭐ XOÁ 1 ITEM: gọi BE, cập nhật lại cart
  const removeItem = async (itemId: number) => {
    try {
      const res = await cartApi.removeItem(itemId);
      setCartProducts((res.data.items as CartItem[]) ?? []);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  // ✅ ĐỔI VARIANT: Dùng context để xử lý cả Guest (localStorage) và Customer (API BE)

  return (
    <div className="flat-spacing-2 pt-0">
      <div className="container">
        <div className="row">
          <div className="col-xl-8">
            <div className="tf-page-cart-main">
              <form className="form-cart" onSubmit={(e) => e.preventDefault()}>
                {cartProducts.length ? (
                  <table className="table-page-cart">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((item, i) => {
                        // dùng cùng logic giá với tổng
                        const unitPrice =
                          (item as any).discountedPrice != null
                            ? Number((item as any).discountedPrice)
                            : Number(item.price || 0);
                        const lineTotal = unitPrice * (item.quantity || 0);

                        return (
                          <tr key={i} className="tf-cart-item file-delete">
                            <td className="tf-cart-item_product">
                              <Link
                                to={`/product-detail/${item.productId}`}
                                className="img-box"
                              >
                                <img
                                  alt="img-product"
                                  src={item.imgSrc}
                                  width={684}
                                  height={972}
                                />
                              </Link>
                              <div className="cart-info">
                                <Link
                                  to={`/product-detail/${item.productId}`}
                                  className="name text-md link fw-medium"
                                >
                                  {item.productName}
                                </Link>

                                {/* ⭐ Hiển thị màu / size hiện tại */}
                                <div className="variants text-sm text-dark-4 mb-1">
                                  {item.color || item.size ? (
                                    <>
                                      {item.color ?? ""}
                                      {item.color && item.size ? " / " : ""}
                                      {item.size ?? ""}
                                    </>
                                  ) : (
                                    "Không có lựa chọn biến thể"
                                  )}
                                </div>

                                {/* ⭐ Select đổi color/size - Hỗ trợ cả Guest và Customer */}
                                {item.variantOptions &&
                                  item.variantOptions.length > 0 && (
                                    <div className="mb-1">
                                      <select
                                        className="form-select form-select-sm"
                                        value={item.variantId ?? undefined}
                                        onChange={(e) => {
                                          const selectedOption = item.variantOptions.find(
                                            (opt) => opt.variantId === Number(e.target.value)
                                          );
                                          if (selectedOption) {
                                            changeCartItemVariant(item.id, selectedOption);
                                          }
                                        }}
                                      >
                                        {item.variantOptions.map((opt) => (
                                          <option
                                            key={opt.variantId}
                                            value={opt.variantId}
                                          >
                                            {(opt.color || "Không màu") +
                                              (opt.size
                                                ? ` / ${opt.size}`
                                                : "") +
                                              " - " +
                                              formatPrice(
                                                Number(opt.price ?? 0)
                                              )}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                {/* ⭐ Xoá item */}
                                <span
                                  className="remove-cart link remove"
                                  onClick={() => removeItem(item.id)}
                                >
                                  Xóa
                                </span>
                              </div>
                            </td>

                            <td className="tf-cart-item_price text-center">
                              <span className="cart-price price-on-sale text-md fw-medium">
                                {formatPrice(unitPrice)}
                              </span>
                            </td>

                            <td
                              className="tf-cart-item_quantity"
                              data-cart-title="Số lượng"
                            >
                              <QuantitySelect
                                quantity={item.quantity}
                                setQuantity={(qty) => {
                                  updateQuantity(item.id, qty); // cart item id
                                }}
                                max={item.maxQuantity}
                              />
                            </td>

                            <td
                              className="tf-cart-item_total text-center"
                              data-cart-title="Tổng"
                            >
                              <div className="cart-total total-price text-md fw-medium">
                                {formatPrice(lineTotal)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4">
                    Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm yêu thích
                    vào giỏ!{" "}
                    <Link
                      className="tf-btn btn-dark2 animate-btn mt-3"
                      to="/shop-default"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                )}
              </form>

              {/* Feature slider giữ nguyên */}
              <div className="fl-iconbox wow fadeInUp">
                <Swiper
                  dir="ltr"
                  className="swiper tf-swiper sw-auto"
                  {...{
                    slidesPerView: 1,
                    spaceBetween: 12,
                    speed: 800,
                    observer: true,
                    observeParents: true,
                    slidesPerGroup: 1,
                    pagination: {
                      el: ".sw-pagination-iconbox",
                      clickable: true,
                    },
                    breakpoints: {
                      575: {
                        slidesPerView: 2,
                        spaceBetween: 12,
                        slidesPerGroup: 2,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                        slidesPerGroup: 3,
                      },
                      1200: { slidesPerView: "auto", spaceBetween: 24 },
                    },
                  }}
                  modules={[Pagination, Navigation]}
                >
                  {iconFeatures.map((elm, i) => (
                    <SwiperSlide key={i} className="swiper-slide">
                      <div className="tf-icon-box justify-content-center justify-content-sm-start style-3">
                        <div className="box-icon">
                          <i className={`icon ${elm.iconClass}`} />
                        </div>
                        <div className="content">
                          <div className="title text-uppercase">
                            {elm.title}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="d-flex d-xl-none sw-dot-default sw-pagination-iconbox justify-content-center" />
              </div>
            </div>
          </div>

          {/* Sidebar tổng tiền */}
          <div className="col-xl-4">
            <div className="tf-page-cart-sidebar">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="cart-box checkout-cart-box"
              >
                <div className="cart-head">
                  <div className="total-discount text-xl fw-medium">
                    <span>Tổng cộng:</span>
                    <span className="total">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <p className="text-sm text-dark-4">
                    Thuế và phí vận chuyển sẽ được tính khi thanh toán
                  </p>
                </div>
                <div className="checkout-btn">
                  <Link
                    to={`/checkout`}
                    className="tf-btn btn-dark2 animate-btn w-100"
                  >
                    Thanh toán
                  </Link>
                </div>
                <div className="cart-imgtrust">
                  <p className="text-center text-sm text-dark-1"></p>
                  <div className="cart-list-social">
                    {/* chỗ icon thanh toán giữ nguyên như bạn đang có */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
