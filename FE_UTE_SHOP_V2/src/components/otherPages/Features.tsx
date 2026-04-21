import { getShopName } from "@/config/shop";

export default function Features() {
  const shopName = getShopName();
  return (
    <section className="flat-spacing-3">
      <div className="container">
        <div className="flat-title-2 text-center">
          <p className="display-md-2 fw-medium">Tại sao chọn {shopName}</p>
          <p className="text-md text-main">
            Sản phẩm của chúng tôi được chế tác với sự đổi mới và theo dõi các xu hướng mới nhất.
            Chúng tôi vượt qua ranh giới của{" "}
            <br className="d-none d-lg-block" />
            thời trang truyền thống, mang đến những thiết kế táo bạo, tươi mới truyền cảm hứng
            tự tin và cá tính.
          </p>
        </div>
        <div className="row">
          <div className="col-xl-7 col-md-6">
            <ul className="list-esd d-md-flex flex-md-column justify-content-md-center h-100">
              <li className="item">
                <h6>Đạo đức &amp; Trách nhiệm</h6>
                <p className="text-md">
                  Tại {shopName}, chúng tôi cam kết duy trì các tiêu chuẩn đạo đức cao nhất
                  trong sản xuất. Chúng tôi đảm bảo sản xuất có ý thức
                  thông qua các cuộc kiểm tra thường xuyên, đào tạo và tập trung mạnh vào
                  nguồn cung có trách nhiệm.
                </p>
              </li>
              <li className="item">
                <h6>Phong cách gặp Độ bền</h6>
                <p className="text-md">
                  Từ may đo cổ điển đến các mặt hàng thường ngày, các bộ sưu tập {shopName}
                  của chúng tôi nắm bắt các xu hướng mới nhất trong khi ưu tiên
                  sự thoải mái và chất lượng lâu dài.
                </p>
              </li>
              <li className="item">
                <h6>Thể hiện bản thân</h6>
<p className="text-md">Các thiết kế của chúng tôi được tạo ra dựa trên những xu hướng thời trang mới nhất, mang đến sự linh hoạt để thể hiện phong cách cá nhân, đặc biệt dành cho giới trẻ hiện đại, quan tâm đến thời trang.</p>
              </li>
            </ul>
          </div>
          <div className="col-xl-5 col-md-6">
            <div className="image radius-16 overflow-hidden w-100 h-100">
              <img
                src="https://i2-vnexpress.vnecdn.net/2022/05/13/dai-hoc-spkt-jpeg-1652454690-2575-1652454864.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=8-Ylh97-1xxHiNW0J0Tq9g"
                alt=""
                className="lazyload w-100 h-100 object-fit-cover"
                width={586}
                height={586}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
