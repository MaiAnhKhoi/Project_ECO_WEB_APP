"use client";
import { features2 } from "@/data/features";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FeaturesSecondary() {
  return (
    <section className="flat-spacing-3 pt-0">
      <div className="container">
        <div className="flat-title-2 d-xl-flex justify-content-xl-between">
          <div className="box-title">
            <p className="display-md-2 fw-medium">Phong cách được chọn lọc riêng cho bạn</p>
            <p className="text-xl">Phong cách được chọn lọc riêng cho bạn</p>
          </div>
          <div className="box-text">
            <p className="text-md">
              Các stylist chuyên nghiệp của chúng tôi đã tỉ mỉ kết hợp các bộ trang phục theo mùa
              vừa <br className="d-none d-xl-block" />
              hợp xu hướng vừa vượt thời gian. Với nhiều phong cách khác nhau, họ ở đây để
              truyền cảm hứng cho bộ trang phục thời trang tiếp theo của bạn.<br className="d-none d-xl-block" />
              bộ trang phục thời trang tiếp theo của bạn.
            </p>
          </div>
        </div>
        {/* <Swiper
          dir="ltr"
          className="swiper tf-swiper"
          {...{
            slidesPerView: 1,
            spaceBetween: 12,
            speed: 800,
            observer: true,
            observeParents: true,
            pagination: { el: ".sw-pagination-iconbox", clickable: true },
            breakpoints: {
              575: { slidesPerView: 2, spaceBetween: 12 },
              992: { slidesPerView: 3, spaceBetween: 24 },
            },
          }}
          modules={[Pagination]}
        >
          {features2.map((item, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div className="tf-icon-box style-border">
                <div className="box-icon">
                  <i className={`icon ${item.icon}`} />
                </div>
                <div className="content">
                  <h6>{item.title}</h6>
                  <p className="text-sm text-line-clamp-4">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="d-flex d-xl-none sw-dot-default sw-pagination-iconbox justify-content-center" />
        </Swiper> */}
      </div>
    </section>
  );
}
