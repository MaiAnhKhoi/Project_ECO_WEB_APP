"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getShopName } from "@/config/shop";

// 👉 Có thể tách ra file "@/types/order" sau
interface OrderAddressInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
}

interface OrderProductInfo {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderSuccessData {
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

export default function OrderSuccess() {
  const [experience, setExperience] = useState(1);
  const [orderData, setOrderData] = useState<OrderSuccessData | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔄 Lấy dữ liệu đơn hàng từ state hoặc localStorage
  useEffect(() => {
    // 1. ưu tiên dữ liệu từ navigate state (COD chuyển sang)
    const state = location.state as { order?: OrderSuccessData } | null;
    if (state?.order) {
      setOrderData(state.order);
      // sync lại localStorage cho chắc (trường hợp user F5 sau đó)
      try {
        localStorage.setItem("lastOrder", JSON.stringify(state.order));
      } catch (e) {
        console.error("Cannot save lastOrder to localStorage", e);
      }
      return;
    }

    // 2. nếu F5 hoặc đi từ PayOS redirect: lấy từ localStorage
    try {
      const stored = localStorage.getItem("lastOrder");
      if (stored) {
        const parsed: OrderSuccessData = JSON.parse(stored);
        setOrderData(parsed);
        return;
      }
    } catch (e) {
      console.error("Cannot parse lastOrder from localStorage", e);
    }

    // 3. không có gì -> cho user quay về trang đơn hàng
    navigate("/account-orders");
  }, [location.state, navigate]);

  const testimonials = [
    {
      text: "Tôi chưa bao giờ cảm thấy tự tin hơn với tủ quần áo của mình! Mọi sản phẩm tôi mua ở đây đều chất lượng cao, hợp thời trang và vừa vặn hoàn hảo. Toàn bộ trải nghiệm mua sắm đã rất suôn sẻ từ đầu đến cuối. Cảm ơn bạn đã làm cho thời trang trở nên dễ dàng như vậy!",
      author: `${getShopName()} P`,
    },
    {
      text: "Tôi chưa bao giờ hạnh phúc hơn với tủ quần áo của mình! Mọi sản phẩm tôi mua đều phong cách, chất lượng cao và vừa vặn như đúc. Quá trình mua sắm rất mượt mà và không căng thẳng từ đầu đến cuối. Thực sự làm cho thời trang trở nên dễ dàng và thú vị!",
      author: "David P",
    },
    {
      text: "Mua sắm ở đây đã hoàn toàn thay đổi phong cách của tôi! Mọi sản phẩm tôi nhận được đều đẹp, được làm tốt và vừa vặn hoàn hảo với tôi. Từ duyệt web đến giao hàng, toàn bộ quá trình đều nhanh chóng và dễ dàng. Cuối cùng tôi thích mặc quần áo mỗi ngày!",
      author: "Henry P",
    },
  ];

  // ⏳ Chưa có data (đang lấy / redirect) -> show tạm
  if (!orderData) {
    return (
      <div className="flat-spacing pb-0">
        <div className="container text-center py-5">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="flat-spacing pb-0">
      <div className="container">
        <div className="title-success-order text-center">
          <img className="icon" src="images/section/success.svg" alt="" />
          <div className="box-title">
            <h3 className="title">Cảm ơn bạn đã đặt hàng!</h3>
            <p className="text-md text-main">
              Bạn thật tuyệt vời, {getShopName()}! Cảm ơn bạn rất nhiều vì đã mua sắm.
            </p>
          </div>
        </div>
      </div>

      <div className="flat-spacing-29">
        <div className="container">
          <div className="row">
            {/* LEFT */}
            <div className="col-xl-8">
              <div className="tf-main-success">
                <div className="box-progress-order">
                  <div className="order-progress-item order-code text-center">
                    <div className="title text-sm fw-medium">Số đơn hàng</div>
                    <div className="text-md fw-medium code">{orderData.orderNumber}</div>
                  </div>
                  <div className="order-progress-item order-date text-center">
                    <div className="title text-sm fw-medium">Ngày đặt hàng</div>
                    <div className="text-md fw-medium date">{orderData.orderDate}</div>
                  </div>
                  <div className="order-progress-item order-total text-center">
                    <div className="title text-sm fw-medium">Tổng đơn hàng</div>
                    <div className="text-md fw-medium total">
                      {formatPrice(orderData.orderTotal)}
                    </div>
                  </div>
                  <div className="order-progress-item payment-method text-center">
                    <div className="title text-sm fw-medium">Phương thức thanh toán</div>
                    <div className="text-md fw-medium metod">
                      {orderData.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* timeline tạm vẫn fix, sau này có API order status thì lấy theo orderId */}
                <div className="box-timeline-order">
                  <div className="timeline-item active text-center">
                    <div className="box-icon">
                      <span className="icon icon-confirm"></span>
                    </div>
                    <div className="content">
                      <div className="title fw-medium text-md">Đã xác nhận</div>
                      <span className="date fw-medium text-sm text-main">
                        {orderData.orderDate}
                      </span>
                    </div>
                  </div>
                  <div className="line-time"></div>
                  <div className="timeline-item text-center">
                    <div className="box-icon">
                      <span className="icon icon-shipped"></span>
                    </div>
                    <div className="content">
                      <div className="title fw-medium text-md">Đã gửi hàng</div>
                      <span className="date fw-medium text-sm text-main">Đang cập nhật</span>
                    </div>
                  </div>
                  <div className="line-time"></div>
                  <div className="timeline-item text-center">
                    <div className="box-icon">
                      <span className="icon icon-location"></span>
                    </div>
                    <div className="content">
                      <div className="title fw-medium text-md">Đã giao hàng</div>
                      <span className="date fw-medium text-sm text-main">Đang cập nhật</span>
                    </div>
                  </div>
                </div>

                {/* map giữ nguyên, không phụ thuộc data */}
                <div className="map-order">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485467675198!2d106.76933817480604!3d10.850632389302683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1763839871768!5m2!1svi!2s"   loading="lazy"
                    width="100%"
                    height="499"
                    style={{ border: "none" }}
                    allowFullScreen={true}
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div className="box-ship-address">
                  <div className="row justify-content-between">
                    <div className="col-12 col-sm-5">
                      <div className="ship-address-item">
                        <div className="text-lg fw-medium title">Địa chỉ giao hàng</div>
                        <ul className="list-address">
                          <li className="text-sm text-main">
                            {orderData.shippingAddress.name}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.shippingAddress.address}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.shippingAddress.city}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.shippingAddress.country}
                          </li>
                          {orderData.shippingAddress.phone && (
                            <li className="text-sm text-main">
                              {orderData.shippingAddress.phone}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="col-12 col-sm-5">
                      <div className="ship-address-item billing mb-0">
                        <div className="text-lg fw-medium title">Địa chỉ thanh toán</div>
                        <ul className="list-address">
                          <li className="text-sm text-main">
                            {orderData.billingAddress.name}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.billingAddress.address}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.billingAddress.city}
                          </li>
                          <li className="text-sm text-main">
                            {orderData.billingAddress.country}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fl-order-testimonial">
                  <Swiper
                    dir="ltr"
                    className="swiper tf-swiper"
                    modules={[Pagination]}
                    {...{
                      slidesPerView: 1,
                      spaceBetween: 12,
                      speed: 800,
                      pagination: { el: ".sw-pagination-tes", clickable: true },
                      breakpoints: {
                        768: { slidesPerView: 1, spaceBetween: 24 },
                      },
                    }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <SwiperSlide key={index} className="swiper-slide">
                        <div className="box-order-tes text-center">
                          <span className="icon icon-quote3"></span>
                          <div className="content">
                            <div className="title text-md text-uppercase fw-medium">
                              KHÁCH HÀNG HÀI LÒNG
                            </div>
                            <p className="note text-xl text-main">
                              "{testimonial.text}"
                            </p>
                          </div>
                          <span className="author font-2 text-md fw-semibold">
                            {testimonial.author}
                          </span>
                        </div>
                      </SwiperSlide>
                    ))}
                    <div className="sw-dot-default style-sm sw-pagination-tes justify-content-center"></div>
                  </Swiper>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-xl-4">
              <div className="tf-page-cart-sidebar sidebar-order-success">
                <div className="cart-box order-box">
                  <div className="title text-lg fw-medium">Chi tiết đơn hàng</div>
                  <ul className="list-order-product">
                    {orderData.products.map((product) => (
                      <li key={product.id} className="order-item">
                        <figure className="img-product">
                          <img src={product.image} alt="product" />
                          <span className="quantity">{product.quantity}</span>
                        </figure>
                        <div className="content">
                          <div className="info">
                            <p className="name text-sm fw-medium">{product.name}</p>
                            <span className="variant">{product.variant}</span>
                          </div>
                          <span className="price text-sm fw-medium">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <ul className="list-total">
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Tổng phụ:</span>
                      <span className="price-sub fw-medium">
                        {formatPrice(orderData.subtotal)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Giảm giá:</span>
                      <span className="price-discount fw-medium">
                        -{formatPrice(orderData.discount)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Vận chuyển:</span>
                      <span className="price-ship fw-medium">
                        {formatPrice(orderData.shipping)}
                      </span>
                    </li>
                    <li className="total-item text-sm d-flex justify-content-between">
                      <span>Thuế:</span>
                      <span className="price-tax fw-medium">
                        {formatPrice(orderData.tax)}
                      </span>
                    </li>
                  </ul>
                  <div className="subtotal text-lg fw-medium d-flex justify-content-between">
                    <span>Tổng cộng:</span>
                    <span className="total-price-order">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                </div>

                <div className="cart-box">
                  <form className="feedback-box">
                    <h6 className="title">Gửi phản hồi cho chúng tôi</h6>
                    <p className="text text-main text-sm">
                      Hãy cho chúng tôi biết bạn nghĩ gì về trải nghiệm mua sắm, và nhận phiếu
                      quà tặng cho lần mua sắm tiếp theo.
                    </p>
                    <fieldset className="tf-field style-2 style-3 mb_16">
                      <input
                        className="tf-field-input tf-input"
                        id="name"
                        placeholder=" "
                        type="text"
                        name="name"
                      />
                      <label className="tf-field-label" htmlFor="name">
                        Tên
                      </label>
                    </fieldset>
                    <fieldset className="tf-field style-2 style-3 mb_16">
                      <input
                        className="tf-field-input tf-input"
                        id="email"
                        placeholder=" "
                        type="email"
                        name="email"
                      />
                      <label className="tf-field-label" htmlFor="email">
                        Email
                      </label>
                    </fieldset>
                    <div className="box-exp mb_16">
                      <p className="mb_6 text-main text-sm">
                        Trải nghiệm của bạn như thế nào?
                      </p>
                      <div className="list-exp">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} htmlFor={`exp${num}`} className="check-exp">
                            <input
                              type="radio"
                              id={`exp${num}`}
                              className="tf-check-rounded"
                              name="checkExperience"
                              checked={experience === num}
                              onChange={() => setExperience(num)}
                            />
                            <span className="text-exp text-sm">{num}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <fieldset className="mb_16">
                      <textarea
                        className="style-2"
                        id="desc"
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                      ></textarea>
                    </fieldset>
                    <button className="tf-btn btn-dark2 w-100 animate-btn" type="submit">
                      Gửi
                    </button>
                  </form>

                  <div className="box-share-social">
                    <h6 className="title">Chia sẻ tình yêu</h6>
                    <div className="tf-social-icon style-large">
                      <a
                        href="https://www.facebook.com/"
                        className="social-item social-facebook"
                      >
                        <i className="icon icon-fb"></i>
                      </a>
                      <a
                        href="https://www.instagram.com/"
                        className="social-item social-instagram"
                      >
                        <i className="icon icon-instagram"></i>
                      </a>
                      <a href="https://x.com/" className="social-item social-x">
                        <i className="icon icon-x"></i>
                      </a>
                      <a
                        href="https://www.snapchat.com/"
                        className="social-item social-snapchat"
                      >
                        <i className="icon icon-snapchat"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END RIGHT */}
          </div>
        </div>
      </div>
    </div>
  );
}
