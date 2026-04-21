"use client";

import { useContextElement } from "@/context/Context";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import addressApi from "@/services/addressApi";
import couponApi from "@/services/couponApi";
import orderApi from "@/services/orderApi";
import PayOSPaymentModal from "@/components/modals/PayOSPaymentModal";
import { setLastPath } from "@/utlis/lastPath";

import { useEffect, useState } from "react";
import { AddressResponse } from "@/types/address";
import { useAuth } from "@/context/authContext";
import type { CouponItem, ApplyCouponResponse } from "@/types/coupon";
import type {
  CheckoutRequest,
  CheckoutResponse,
  OrderSuccessData
} from "@/types/order";

export default function Checkout() {
  const { cartProducts, totalPrice } = useContextElement();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check login - nếu chưa login thì bắt đăng nhập
  useEffect(() => {
    if (!user) {
      // Lưu lại path checkout để quay lại sau khi login
      setLastPath("/checkout");
      
      // Mở modal login
      const loginEl = document.getElementById("login");
      if (loginEl) {
        import("bootstrap").then((bootstrap) => {
          const Offcanvas = bootstrap.Offcanvas as any;
          let bsOffcanvas = Offcanvas.getInstance(loginEl);
          if (!bsOffcanvas) {
            bsOffcanvas = new Offcanvas(loginEl);
          }
          bsOffcanvas.show();
        });
      }
      // Không redirect, giữ nguyên ở trang checkout để user thấy modal login
    }
  }, [user, navigate]);

  const handleCheckPaid = async (orderId: number) => {
  const res = await orderApi.checkPayOSStatus(orderId);
  return {
    paymentStatus: res.data.paymentStatus,
    orderStatus: res.data.orderStatus,
  };
};

  // 💳 PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYOS">("COD");

  // Đặt hàng
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // PAYOS MODAL state
  const [showPayosModal, setShowPayosModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [payosCheckoutUrl, setPayosCheckoutUrl] = useState<string>("");
  const [payosQrUrl, setPayosQrUrl] = useState<string>("");
  const [paymentExpiresAt, setPaymentExpiresAt] = useState<string | null>(null);

  // 🏠 ĐỊA CHỈ MẶC ĐỊNH
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(true);
  const [addressError, setAddressError] = useState<string>("");

  // 🎟️ COUPON STATE
  const [availableCoupons, setAvailableCoupons] = useState<CouponItem[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>("");
  const [couponSuccess, setCouponSuccess] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  // 🚚 SHIPPING & TAX
  const subtotal = totalPrice || 0;
  const [shippingFee, setShippingFee] = useState<number>(0);
  const taxFee = subtotal ? 10000 : 0; // tạm fix 10k thuế nếu có đơn

  const [note, setNote] = useState("");

  const finalTotal = subtotal ? subtotal - discount + shippingFee + taxFee : 0;

  // 📝 LOAD ĐỊA CHỈ MẶC ĐỊNH
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        setLoadingAddress(true);
        setAddressError("");

        const res = await addressApi.getDefault();
        setAddress(res.data);
      } catch (err: any) {
        setAddressError("Không thể tải địa chỉ mặc định.");
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchDefaultAddress();
  }, []);

  // 🎟️ LOAD COUPON
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const res = await couponApi.getActiveCoupons();
        setAvailableCoupons(res.data);
      } catch (err: any) {
        setCouponError("Không thể tải mã giảm giá.");
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCoupons();
  }, []);


 useEffect(() => {
if ((window as any).hasCheckedPayOS) return;
(window as any).hasCheckedPayOS = true;;

  const pendingPayStr = localStorage.getItem("pendingPayOSPayment");
  if (!pendingPayStr) return;

  try {
    const pendingPay = JSON.parse(pendingPayStr);
    if (!pendingPay?.orderId || !pendingPay?.checkoutUrl) throw new Error("Dữ liệu không hợp lệ");

    setCurrentOrderId(pendingPay.orderId);
    setPayosCheckoutUrl(pendingPay.checkoutUrl);
    setPayosQrUrl(pendingPay.qrUrl || "");
    setPaymentExpiresAt(pendingPay.expiresAt || null);
    setShowPayosModal(true);
  } catch (err) {
    localStorage.removeItem("pendingPayOSPayment");
    setShowPayosModal(false);
  }
}, []);



const handleCloseModal = () => {
  setShowPayosModal(false);
  // localStorage.removeItem("pendingPayOSPayment");
};
  // 🎟️ ÁP DỤNG COUPON
  const handleApplyCoupon = async (code?: string, e?: React.FormEvent) => {
    e?.preventDefault();

    const codeToApply = code || couponCode;

    if (!subtotal) {
      setCouponError("Giỏ hàng của bạn đang trống.");
      setCouponSuccess("");
      return;
    }

    if (!codeToApply.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      setCouponSuccess("");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponSuccess("");

      const res = await couponApi.applyCoupon({
        code: codeToApply.trim(),
        subtotal,
      });

      const data: ApplyCouponResponse = res.data;

      setDiscount(data.discountAmount);
      setCouponCode(codeToApply);
      setCouponSuccess(data.message || "Áp dụng mã thành công.");
    } catch (err: any) {
      setCouponError(
        err?.response?.data?.message ||
          "Mã giảm giá không hợp lệ hoặc không sử dụng được."
      );
      setDiscount(0);
      setCouponSuccess("");
    } finally {
      setCouponLoading(false);
    }
  };

  // 🔄 SHIPPING
  const handleChangeShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.id;
    if (value === "freeship") {
      setShippingFee(0);
    } else if (value === "expship") {
      setShippingFee(10000);
    }
  };

  // 🧾 ĐẶT HÀNG
const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  setOrderError("");

  if (!user) {
    setOrderError("Bạn cần đăng nhập để đặt hàng.");
    return;
  }

  if (!cartProducts.length) {
    setOrderError("Giỏ hàng của bạn đang trống.");
    return;
  }

  if (!address?.id) {
    setOrderError("Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng.");
    return;
  }

  if (!finalTotal || finalTotal <= 0) {
    setOrderError("Tổng tiền không hợp lệ.");
    return;
  }

  // 🔥 CHECK THIẾU VARIANT (màu/size) TRƯỚC KHI MAP
  const hasInvalidVariant = cartProducts.some(
    (item) => item.variantId == null
  );

  if (hasInvalidVariant) {
    setOrderError(
      "Có sản phẩm chưa chọn phiên bản (màu/size). Vui lòng kiểm tra lại giỏ hàng."
    );
    return;
  }

  try {
    setPlacingOrder(true);

    // map cart -> items (lúc này TypeScript hiểu variantId là number nhờ check phía trên)
    const items = cartProducts.map((item) => ({
      productId: item.productId,
      variantId: item.variantId as number, // ✅ đã check null ở trên, nên ép kiểu an toàn
      quantity: item.quantity || 1,
      unitPrice: item.price,
    }));

    const payload: CheckoutRequest = {
      addressId: address.id,
      paymentMethod,
      subtotal,
      discountTotal: discount,
      taxTotal: taxFee,
      shippingFee,
      grandTotal: finalTotal,
      couponCode: couponCode || null,
      note,
      items,
    };

    const res = await orderApi.checkout(payload);
    const data: CheckoutResponse = res.data;

    setCurrentOrderId(data.orderId || null);

    // ================================
    // 🔹 BUILD DATA CHO ORDER SUCCESS
    // ================================
    const productsForSuccess = cartProducts.map((p) => {
      // tuỳ theo CartItem của bạn đang có field gì thì dùng đúng tên
      // dùng as any để tránh TS phàn nàn nếu type chưa khai báo color/size
      const color =
        (p as any).colorName ||
        (p as any).colorLabel ||
        (p as any).color ||
        "";
      const size =
        (p as any).sizeName ||
        (p as any).sizeLabel ||
        (p as any).size ||
        "";

      const variantText = [color, size].filter(Boolean).join(" / ") || "";

      return {
        id: p.productId,
        name: p.productName,
        variant: variantText,
        price: p.price,
        quantity: p.quantity || 1,
        image: p.imgSrc,
      };
    });

    const orderSuccessData: OrderSuccessData = {
      orderId: data.orderId,
      orderNumber: data.orderCode || `#${data.orderId}`,
      // CheckoutResponse hiện tại chưa có createdAt -> dùng thời điểm hiện tại
      orderDate: new Date().toLocaleString("vi-VN"),
      // CheckoutResponse cũng chưa khai báo grandTotal -> dùng finalTotal FE đã tính
      orderTotal: finalTotal,
      paymentMethod:
        paymentMethod === "COD"
          ? "Thanh toán khi nhận hàng"
          : "PayOS",

      shippingAddress: {
        name: `${address.firstName} ${address.lastName}`,
        address: address.address1,
        city: address.city,
        country: address.region,
        phone: address.phone,
      },
      billingAddress: {
        name: `${address.firstName} ${address.lastName}`,
        address: address.address1,
        city: address.city,
        country: address.region,
      },

      products: productsForSuccess,

      subtotal,
      discount,
      shipping: shippingFee,
      tax: taxFee,
      total: finalTotal,
    };

    // 💾 LƯU LẠI ĐỂ ORDER SUCCESS LOAD LÊN (F5 / redirect từ PayOS)
    localStorage.setItem("lastOrder", JSON.stringify(orderSuccessData));

    // ================================
    // 🔹 ĐIỀU HƯỚNG THEO PAYMENT METHOD
    // ================================
    if (paymentMethod === "COD") {
      // truyền luôn state để OrderSuccess dùng trực tiếp
      navigate(`/order-success?orderId=${data.orderId}`, {
        state: { order: orderSuccessData },
      });
      return;
    }

if (paymentMethod === "PAYOS") {
  if (!data.payosCheckoutUrl) {
    setOrderError("Không tạo được link thanh toán PayOS.");
    return;
  }
  setPayosCheckoutUrl(data.payosCheckoutUrl || "");
  setPayosQrUrl(data.payosQrUrl || "");
  setPaymentExpiresAt(data.paymentExpiresAt || null);
  setCurrentOrderId(data.orderId || null);
  setShowPayosModal(true);

  // lưu pending payment vào localStorage - GẮN THÊM "from: checkout"
  const pendingPayos = {
    from: "checkout",                       // 👈 THÊM DÒNG NÀY
    orderId: data.orderId,
    checkoutUrl: data.payosCheckoutUrl,
    qrUrl: data.payosQrUrl,
    expiresAt: data.paymentExpiresAt,
  };
  localStorage.setItem("pendingPayOSPayment", JSON.stringify(pendingPayos));
}

  } catch (err: any) {
    setOrderError(
      err?.response?.data?.message ||
        "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại."
    );
  } finally {
    setPlacingOrder(false);
  }
};


  return (
    <>
      <div className="flat-spacing-25">
        <div className="container">
          <div className="row">
            {/* LEFT: THÔNG TIN THANH TOÁN */}
            <div className="col-xl-8">
              <form className="tf-checkout-cart-main">
                <div className="box-ip-checkout">
                  <div className="title text-xl fw-medium">Thanh toán</div>

                  {loadingAddress && (
                    <p className="text-sm text-main mb_12">
                      Đang tải địa chỉ mặc định...
                    </p>
                  )}
                  {addressError && (
                    <p className="text-sm text-danger mb_12">
                      {addressError}
                    </p>
                  )}

                  <div className="grid-2 mb_16">
                    <div className="tf-field style-2 style-3">
                      <input
                        className="tf-field-input tf-input"
                        id="firstname"
                        placeholder=" "
                        type="text"
                        name="firstname"
                        value={address?.firstName || ""}
                        disabled
                      />
                      <label className="tf-field-label" htmlFor="firstname">
                        Họ
                      </label>
                    </div>
                    <div className="tf-field style-2 style-3">
                      <input
                        className="tf-field-input tf-input"
                        id="lastname"
                        placeholder=" "
                        type="text"
                        name="lastname"
                        value={address?.lastName || ""}
                        disabled
                      />
                      <label className="tf-field-label" htmlFor="lastname">
                        Tên
                      </label>
                    </div>
                  </div>

                  <fieldset className="tf-field style-2 style-3 mb_16">
                    <input
                      className="tf-field-input tf-input"
                      id="country"
                      type="text"
                      name="country"
                      placeholder=""
                      value={address?.region || ""}
                      disabled
                    />
                    <label className="tf-field-label" htmlFor="country">
                      Quốc gia
                    </label>
                  </fieldset>

                  <fieldset className="tf-field style-2 style-3 mb_16">
                    <input
                      className="tf-field-input tf-input"
                      id="address"
                      type="text"
                      name="address"
                      placeholder=""
                      value={address?.address1 || ""}
                      disabled
                    />
                    <label className="tf-field-label" htmlFor="address">
                      Địa chỉ
                    </label>
                  </fieldset>

                  <fieldset className="mb_16">
                    <input
                      type="text"
                      className="style-2"
                      name="apartment"
                      placeholder="Căn hộ, số nhà, v.v. (tùy chọn)"
                      value={address?.company || ""}
                      disabled
                    />
                  </fieldset>

                  <div className="grid-3 mb_16">
                    <fieldset className="tf-field style-2 style-3">
                      <input
                        className="tf-field-input tf-input"
                        id="city"
                        type="text"
                        name="city"
                        placeholder=""
                        value={address?.city || ""}
                        disabled
                      />
                      <label className="tf-field-label" htmlFor="city">
                        Thành phố
                      </label>
                    </fieldset>
                    <div className="tf-select select-square">
                      <select name="State" id="state" disabled>
                        <option value="">
                          {address?.province || "Tỉnh/Thành phố"}
                        </option>
                      </select>
                    </div>
                    <fieldset className="tf-field style-2 style-3">
                      {/* bỏ mã bưu điện cho gọn */}
                    </fieldset>
                  </div>

                  <fieldset className="tf-field style-2 style-3 mb_16">
                    <input
                      className="tf-field-input tf-input"
                      id="phone"
                      type="text"
                      name="phone"
                      placeholder=""
                      value={address?.phone || ""}
                      disabled
                    />
                    <label className="tf-field-label" htmlFor="phone">
                      Số điện thoại
                    </label>
                  </fieldset>
                </div>

                {/* SHIPPING METHOD */}
                <div className="box-ip-shipping">
                  <div className="title text-xl fw-medium">
                    Phương thức vận chuyển
                  </div>

                  <fieldset className="mb_16">
                    <label htmlFor="freeship" className="check-ship">
                      <input
                        type="radio"
                        id="freeship"
                        className="tf-check-rounded"
                        name="checkshipping"
                        defaultChecked
                        onChange={handleChangeShipping}
                      />
                      <span className="text text-sm">
                        <span>Miễn phí vận chuyển</span>
                        <span className="price">{formatPrice(0)}</span>
                      </span>
                    </label>
                  </fieldset>

                  <fieldset>
                    <label htmlFor="expship" className="check-ship">
                      <input
                        type="radio"
                        id="expship"
                        className="tf-check-rounded"
                        name="checkshipping"
                        onChange={handleChangeShipping}
                      />
                      <span className="text text-sm">
                        <span>Chuyển nhanh</span>
                        <span className="price">
                          {formatPrice(10000)}
                        </span>
                      </span>
                    </label>
                  </fieldset>
                </div>

                {/* 🎟️ MÃ GIẢM GIÁ */}
                {loadingCoupons ? (
                  <p className="text-sm text-main mt_8">
                    Đang tải mã giảm giá...
                  </p>
                ) : (
                  availableCoupons.length > 0 && (
                    <div className="coupon-box mt_16 mb_16">
                      <div className="text-sm fw-medium mb_8">
                        Các mã giảm giá khả dụng
                      </div>
                      <ul className="list-coupons">
                        {availableCoupons.map((c, i) => {
                          const isApplied = couponCode === c.code;
                          const discountText =
                            c.type === "PERCENT"
                              ? `${c.value}%`
                              : formatPrice(c.value);

                          return (
                            <li
                              key={i}
                              className="text-sm text-main mb-2 d-flex justify-content-between align-items-center"
                            >
                              <span>
                                {c.code} - Giảm {discountText}
                              </span>

                              {isApplied ? (
                                <span className="tf-btn btn-success btn-sm text-center w-[90px] py-1 text-xs ms-2">
                                  Đã áp dụng
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="tf-btn btn-dark2 btn-sm text-center w-[90px] py-1 text-xs ms-2"
                                  onClick={() => handleApplyCoupon(c.code)}
                                >
                                  Áp dụng
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      {couponError && (
                        <p className="text-danger text-xs mt_4">
                          {couponError}
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-success text-xs mt_1">
                          {couponSuccess}
                        </p>
                      )}
                    </div>
                  )
                )}

                {/* 📝 NOTE */}
                <div className="mt_16">
                  <div className="text-sm fw-medium mb_4">
                    Ghi chú cho đơn hàng
                  </div>
                  <textarea
                    className="tf-input"
                    placeholder="Nhập ghi chú..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* PAYMENT METHOD */}
                <div className="box-ip-payment">
                  <div className="title">
                    <div className="text-lg fw-medium mb_4">Thanh toán</div>
                    <p className="text-sm text-main">
                      Tất cả giao dịch đều được bảo mật và mã hóa.
                    </p>
                  </div>

                  <div className="payment-method-box" id="payment-method-box">
                    {/* COD */}
                    <div className="payment-item mb_16">
                      <label
                        htmlFor="cod"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#cod-payment"
                        aria-controls="cod-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="cod"
                          defaultChecked
                          onChange={() => setPaymentMethod("COD")}
                        />
                        <span className="pay-title text-sm">
                          Thanh toán khi nhận hàng
                        </span>
                      </label>
                      <div
                        id="cod-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      />
                    </div>

                    {/* PAYOS */}
                    <div className="payment-item mb_16">
                      <label
                        htmlFor="payos"
                        className="payment-header collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#payos-payment"
                        aria-controls="payos-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="payos"
                          onChange={() => setPaymentMethod("PAYOS")}
                        />
                        <span className="pay-title text-sm">
                          PayOS
                          <img
                            className="card-logo"
                            width={78}
                            height={20}
                            alt="payos"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7vgZTkIfuS2eCu327OdAKbRIPkGznAN9Gg&s"
                          />
                        </span>
                      </label>
                      <div
                        id="payos-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      />
                    </div>
                  </div>

                  <p className="text-dark-6 text-sm">
                    Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng,
                    hỗ trợ trải nghiệm của bạn trên trang web này, và cho các
                    mục đích khác được mô tả trong{" "}
                    <Link
                      to={`/privacy-policy`}
                      className="fw-medium text-decoration-underline link text-sm"
                    >
                      chính sách bảo mật.
                    </Link>
                  </p>

                  {orderError && (
                    <p className="text-danger text-sm mt_8">{orderError}</p>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT: CART SUMMARY + BUTTON ĐẶT HÀNG */}
            <div className="col-xl-4">
              <div className="tf-page-cart-sidebar">
                <form className="cart-box order-box">
                  <div className="title text-lg fw-medium">
                    Trong giỏ hàng của bạn
                  </div>

                  {cartProducts.length ? (
                    <ul className="list-order-product">
                      {cartProducts.map((product, i) => (
                        <li key={i} className="order-item">
                          <figure className="img-product">
                            <img
                              alt="product"
                              src={product.imgSrc}
                              width={144}
                              height={188}
                            />
                            <span className="quantity">
                              {product.quantity}
                            </span>
                          </figure>
                          <div className="content">
                            <div className="info">
                              <p className="name text-sm fw-medium">
                                {product.productName}
                              </p>
                              {/* TODO: lấy color/size từ cart nếu có */}
                              <span className="variant">Trắng / L</span>
                            </div>
                            <span className="price text-sm fw-medium">
                              {formatPrice(
                                product.price * (product.quantity || 1)
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
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

                  {/* TỔNG QUAN ĐƠN HÀNG */}
                  <ul className="list-total">
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Tạm tính:</span>
                      <span className="price-sub fw-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Giảm giá:</span>
                      <span className="price-discount fw-medium">
                        -{formatPrice(discount)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Vận chuyển:</span>
                      <span className="price-ship fw-medium">
                        {formatPrice(subtotal ? shippingFee : 0)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Thuế:</span>
                      <span className="price-tax fw-medium">
                        {formatPrice(subtotal ? taxFee : 0)}
                      </span>
                    </li>
                  </ul>

                  <div className="subtotal text-lg fw-medium d-flex justify-content-between">
                    <span>Tổng cộng:</span>
                    <span className="total-price-order">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <p className="text-xs text-dark-6 mt_8">
                    Lưu ý: Tổng cộng đã bao gồm giảm giá, phí vận chuyển và thuế.
                  </p>

                  <div className="btn-order">
                    <button
                      type="submit"
                      className="tf-btn btn-dark2 animate-btn w-100"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? "Đang xử lý..." : "Đặt hàng"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* END RIGHT */}
          </div>
        </div>
      </div>

      {/* MODAL PAYOS */}
<PayOSPaymentModal
  isOpen={showPayosModal}
  onClose={handleCloseModal}
  orderId={currentOrderId}
  checkoutUrl={payosCheckoutUrl}
  qrContent={payosQrUrl}
  expiresAt={paymentExpiresAt}
  onCheckPaid={handleCheckPaid}
  onGoToOrders={() => navigate("/account-orders")}
/>


    </>
  );
}
