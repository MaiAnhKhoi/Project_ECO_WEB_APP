import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import { Link } from "react-router-dom";

import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata, getContactEmail } from "@/config/shop";

const metadata = createPageMetadata("Chính sách bảo mật");

export default function PrivacyPolicyPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <>
        {/* Breadcrumb */}
        <div className="tf-breadcrumb">
          <div className="container">
            <ul className="breadcrumb-list">
              <li className="item-breadcrumb">
                <Link to={`/`} className="text">
                  Trang chủ
                </Link>
              </li>
              <li className="item-breadcrumb dot">
                <span />
              </li>
              <li className="item-breadcrumb">
                <span className="text">Chính sách bảo mật</span>
              </li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Title Page */}
        <section className="s-title-page">
          <div className="container">
            <h4 className="s-title letter-0 text-center">Chính sách bảo mật</h4>
          </div>
        </section>
        {/* /Title Page */}
        {/* Privacy policy */}
        <section className="s-term-user flat-spacing-2">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="content">
                  <div className="term-item">
                    <p className="term-title">1. Thông tin chúng tôi thu thập</p>
                    <div className="text-wrap">
                      <p className="term-text">
                        Khi bạn truy cập website, chúng tôi tự động thu thập một số thông tin về thiết bị của bạn, bao gồm trình duyệt web, địa chỉ IP, múi giờ và một số cookie được cài trên thiết bị. Ngoài ra, khi bạn duyệt web, chúng tôi thu thập thông tin về các trang web hoặc sản phẩm bạn xem, các website hoặc từ khóa tìm kiếm dẫn bạn đến website, và thông tin về cách bạn tương tác với website. Chúng tôi gọi các thông tin này là "Thông tin thiết bị".
                      </p>
                      <p className="term-text">
                        Chúng tôi thu thập Thông tin thiết bị bằng các công nghệ sau:
                      </p>
                      <p className="term-text">
                        "Cookie" là các tệp dữ liệu được đặt trên thiết bị hoặc máy tính của bạn và thường chứa một định danh ẩn danh. Để biết thêm thông tin về cookie và cách tắt cookie, vui lòng truy cập link sau: <br />
                        (.....) <br />
                        "File nhật ký" ghi lại các hành động xảy ra trên website, bao gồm địa chỉ IP, loại trình duyệt, nhà cung cấp dịch vụ Internet, trang giới thiệu/thoát, ngày giờ. "Web beacon", "tag" và "pixel" là các tệp điện tử dùng để ghi nhận cách bạn duyệt web. Ngoài ra, khi bạn thực hiện giao dịch mua hàng, chúng tôi thu thập thông tin như tên, địa chỉ thanh toán, địa chỉ giao hàng và thông tin thanh toán. Chúng tôi gọi các thông tin này là "Thông tin đơn hàng".
                      </p>
                    </div>
                  </div>
                  <div className="term-item">
                    <p className="term-title">2. Cách chúng tôi sử dụng thông tin của bạn</p>
                    <div className="text-wrap">
                      <p className="term-text">
                        Chúng tôi sử dụng Thông tin đơn hàng chủ yếu để thực hiện các đơn hàng đặt qua website (bao gồm xử lý thanh toán, sắp xếp giao hàng và cung cấp hóa đơn hoặc xác nhận đơn hàng). Ngoài ra, chúng tôi sử dụng Thông tin đơn hàng để:
                      </p>
                      <p className="term-text">
                        Liên hệ với bạn; <br />
                        Kiểm tra các đơn hàng để phòng rủi ro hoặc gian lận; <br />
                        Khi phù hợp với sở thích mà bạn đã chia sẻ, cung cấp thông tin hoặc quảng cáo liên quan đến sản phẩm/dịch vụ của chúng tôi. <br />
                        Chúng tôi sử dụng Thông tin thiết bị để giúp kiểm tra rủi ro và gian lận (đặc biệt là địa chỉ IP) và cải thiện website, ví dụ như phân tích cách khách hàng tương tác với website và đánh giá hiệu quả các chiến dịch marketing.
                      </p>
                    </div>
                  </div>
                  <div className="term-item">
                    <p className="term-title">3. Chia sẻ thông tin cá nhân</p>
                    <div className="text-wrap">
                      <p className="term-text">
                        Chúng tôi có thể chia sẻ Thông tin cá nhân với bên thứ ba để giúp sử dụng thông tin như đã nêu. Ví dụ, chúng tôi sử dụng Shopify để vận hành cửa hàng trực tuyến. Bạn có thể xem thêm cách Shopify sử dụng Thông tin cá nhân tại: https://www.shopify.com/legal/privacy. Chúng tôi cũng sử dụng Google Analytics để phân tích cách khách hàng sử dụng website. Bạn có thể đọc thêm cách Google sử dụng Thông tin cá nhân tại: https://www.google.com/intl/en/policies/privacy/. Bạn cũng có thể từ chối Google Analytics tại: https://tools.google.com/dlpage/gaoptout.
                      </p>
                      <p className="term-text">
                        Chúng tôi cũng có thể chia sẻ thông tin cá nhân để tuân thủ pháp luật, phản hồi trát đòi, lệnh tìm kiếm hoặc yêu cầu hợp pháp khác, hoặc để bảo vệ quyền lợi của chúng tôi.
                      </p>
                    </div>
                  </div>
                  <div className="term-item">
                    <p className="term-title">4. Lưu trữ dữ liệu</p>
                    <p className="term-text">
                      Khi bạn đặt hàng, chúng tôi sẽ lưu trữ Thông tin đơn hàng để quản lý hồ sơ cho đến khi bạn yêu cầu xóa.
                    </p>
                  </div>
                  <div className="term-item">
                    <p className="term-title">5. Quyền lợi của bạn</p>
                    <p className="term-text">
                      Bạn chịu trách nhiệm giữ bảo mật tài khoản và mật khẩu, và chịu trách nhiệm cho tất cả hoạt động xảy ra dưới tài khoản của bạn. Website và Công ty Pte Ltd có quyền từ chối dịch vụ, chấm dứt tài khoản, xóa hoặc chỉnh sửa nội dung, hoặc hủy đơn hàng. Khi đặt hàng, bạn xác nhận đã trên 18 tuổi và cung cấp thông tin chính xác cho shop.
                    </p>
                  </div>
                  <div className="term-item">
                    <p className="term-title">6. Thay đổi</p>
                    <p className="term-text">
                      Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh thay đổi trong thực tiễn hoạt động hoặc lý do pháp lý.
                    </p>
                  </div>
                  <div className="term-item">
                    <p className="term-title">7. Liên hệ chúng tôi</p>
                    <div className="text-wrap">
                      <p className="term-text">
                        Để biết thêm thông tin về chính sách bảo mật, nếu có thắc mắc hoặc muốn khiếu nại, vui lòng liên hệ qua email hoặc địa chỉ dưới đây:
                      </p>
                      <a href={`mailto:${getContactEmail()}`} className="link">
                        {getContactEmail()}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Privacy policy */}
      </>

      <Footer />
    </>
  );
}
