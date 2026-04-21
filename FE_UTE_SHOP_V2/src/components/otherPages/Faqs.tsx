import { Link } from "react-router-dom";

export default function Faqs() {
  return (
    <section className="s-faq flat-spacing-13">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="sb-contact">
              <p className="title">Liên hệ chúng tôi</p>
              <p className="sub">
                Nếu bạn gặp vấn đề hoặc có thắc mắc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
              </p>
              <p className="sub">
                Vui lòng chờ 06 - 12 ngày làm việc kể từ khi hàng về đến kho của chúng tôi để hoàn tiền được xử lý.
              </p>
              <div className="btn-group">
                <Link
                  to={`/contact-us`}
                  className="tf-btn btn-fill hover-primary"
                >
                  Liên hệ
                </Link>
                <a href="#" className="tf-btn btn-white hover-primary">
                  Chat với chúng tôi
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <ul className="faq-list">
              <li className="faq-item">
                <p className="name-faq">Thông tin mua hàng</p>
                <div className="faq-wrap" id="accordionShoping">
                  <div className="widget-accordion">
                    <div
                      className="accordion-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      role="button"
                    >
                      <span>Đơn hàng của tôi sẽ mất bao lâu để gửi đi?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionShoping"
                    >
                      <div className="accordion-body widget-desc">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                      role="button"
                    >
                      <span>Cửa hàng có giao hàng miễn phí không?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionShoping"
                    >
                      <div className="accordion-body widget-material">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                      role="button"
                    >
                      <span>Có thể thay đổi địa chỉ giao hàng sau khi đặt đơn không?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionShoping"
                    >
                      <div className="accordion-body">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                      role="button"
                    >
                      <span>Nếu đơn hàng của tôi bị chậm hoặc thất lạc thì sao?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionShoping"
                    >
                      <div className="accordion-body">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="faq-item">
                <p className="name-faq">Thông tin thanh toán</p>
                <div className="faq-wrap" id="accordionPayment">
                  <div className="widget-accordion">
                    <div
                      className="accordion-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePaymentOne"
                      aria-expanded="true"
                      aria-controls="collapsePaymentOne"
                      role="button"
                    >
                      <span>Đơn hàng của tôi sẽ mất bao lâu để gửi đi?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapsePaymentOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionPayment"
                    >
                      <div className="accordion-body widget-desc">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePaymentTwo"
                      aria-expanded="false"
                      aria-controls="collapsePaymentTwo"
                      role="button"
                    >
                      <span>Cửa hàng có giao hàng miễn phí không?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapsePaymentTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionPayment"
                    >
                      <div className="accordion-body widget-material">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePaymentThree"
                      aria-expanded="false"
                      aria-controls="collapsePaymentThree"
                      role="button"
                    >
                      <span>Có thể thay đổi địa chỉ giao hàng sau khi đặt đơn không?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapsePaymentThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionPayment"
                    >
                      <div className="accordion-body">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePaymentFour"
                      aria-expanded="false"
                      aria-controls="collapsePaymentFour"
                      role="button"
                    >
                      <span>Nếu đơn hàng của tôi bị chậm hoặc thất lạc thì sao?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapsePaymentFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionPayment"
                    >
                      <div className="accordion-body">
                        <p>
                          Nếu bạn gặp vấn đề hoặc cần hỗ trợ ngay, hãy nhấn nút bên dưới để trò chuyện trực tiếp với nhân viên Chăm sóc Khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="faq-item">
                <p className="name-faq">Trả hàng & Đổi hàng</p>
                <div className="faq-wrap" id="accordionExchange">
                  <div className="widget-accordion">
                    <div
                      className="accordion-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExchangeOne"
                      aria-expanded="true"
                      aria-controls="collapseExchangeOne"
                      role="button"
                    >
                      <span>Chính sách trả hàng là gì?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseExchangeOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExchange"
                    >
                      <div className="accordion-body widget-desc">
                        <p>
                          Chúng tôi nhận trả hàng trong vòng 14 ngày kể từ khi nhận. Sản phẩm phải chưa mặc, chưa giặt và còn nguyên trạng ban đầu.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExchangeTwo"
                      aria-expanded="false"
                      aria-controls="collapseExchangeTwo"
                      role="button"
                    >
                      <span>Làm sao để trả hàng?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseExchangeTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExchange"
                    >
                      <div className="accordion-body widget-material">
                        <p>
                          Liên hệ đội ngũ chăm sóc khách hàng để xin mã trả hàng, chúng tôi sẽ hướng dẫn bạn gửi sản phẩm về lại.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExchangeThree"
                      aria-expanded="false"
                      aria-controls="collapseExchangeThree"
                      role="button"
                    >
                      <span>Sản phẩm nào không thể trả?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseExchangeThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExchange"
                    >
                      <div className="accordion-body">
                        <p>
                          Các sản phẩm giảm giá, sản phẩm đặt riêng và đồ lót không được trả lại.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-accordion">
                    <div
                      className="accordion-title collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExchangeFour"
                      aria-expanded="false"
                      aria-controls="collapseExchangeFour"
                      role="button"
                    >
                      <span>Khi nào tôi nhận được hoàn tiền?</span>
                      <span className="icon icon-arrow-down" />
                    </div>
                    <div
                      id="collapseExchangeFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExchange"
                    >
                      <div className="accordion-body">
                        <p>
                          Khi hàng trả về được kiểm tra, chúng tôi sẽ hoàn tiền trong vòng 5-7 ngày làm việc.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
