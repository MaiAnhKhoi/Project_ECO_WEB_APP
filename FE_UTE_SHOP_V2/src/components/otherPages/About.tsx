import { getShopName } from "@/config/shop";

export default function About() {
  const shopName = getShopName();
  return (
    <section className="flat-spacing-3 pb-0">
      <div className="container">
        <div className="flat-title-2 d-xl-flex justify-content-xl-between">
          <div className="box-title">
            <p className="display-lg-2 fw-medium">Chào mừng đến với {shopName}</p>
            <p className="text-xl">Điểm Đến Thời Trang Tuyệt Vời</p>
          </div>
          <div className="box-text">
            <p className="text-md">
              Tại <span className="fw-medium">{shopName}</span>, chúng tôi mang đến cho bạn
              những bộ sưu tập được tuyển chọn kỹ lưỡng, kết hợp giữa
              <br className="d-none d-xl-block" />
              thiết kế hiện đại với vẻ đẹp vượt thời gian. Với hơn 15 năm kinh nghiệm,
              chúng tôi phục vụ <br className="d-none d-xl-block" />
              những người đam mê thời trang, những người đánh giá cao chất lượng, phong cách và
              tính linh hoạt.
            </p>
          </div>
        </div>
        <div className="image radius-16 overflow-hidden">
          <img
            src="https://xdcs.cdnchinhphu.vn/446259493575335936/2023/8/22/truong-dai-hoc-su-pham-ky-thuat-tphcm-trang-tuyen-sinh-16927069628961088573361.jpg"
            alt=""
            className="lazyload"
            width={1440}
            height={502}
          />
        </div>
      </div>
    </section>
  );
}
