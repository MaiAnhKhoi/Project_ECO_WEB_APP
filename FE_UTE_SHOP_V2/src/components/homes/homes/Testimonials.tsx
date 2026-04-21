"use client";

import { useEffect, useState } from "react";
import reviewApi from "@/services/reviewApi";
import { TestimonialItem } from "@/types/review";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewApi
      .getTestimonials()
      .then((res: any) => {
        // 👈 ép kiểu res là any để TS không kêu
        const raw: any = res?.data;

        // Chuẩn hoá: nếu BE trả thẳng array -> dùng luôn
        // nếu BE bọc trong { data: [...] } -> lấy raw.data
        const list: TestimonialItem[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];

        setTestimonials(list);
      })
      .catch((err: any) => {
        console.error("Error loading testimonials:", err);
        setTestimonials([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // hoặc skeleton

  const items = Array.isArray(testimonials) ? testimonials : [];

  return (
    <section>
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Đánh giá từ khách hàng</h4>
        </div>

        {items.length === 0 && <p>Chưa có đánh giá nào.</p>}

        {items.length > 0 && (
          <Swiper
            dir="ltr"
            className="swiper tf-swiper"
            {...{
              slidesPerView: 1,
              spaceBetween: 12,
              speed: 800,
              observer: true,
              observeParents: true,
              slidesPerGroup: 1,
              pagination: { el: ".sw-pagination-tes", clickable: true },
              breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 24, slidesPerGroup: 2 },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                  slidesPerGroup: 3,
                },
              },
            }}
            modules={[Pagination]}
          >
            {items.map((item, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div
                  className="wg-testimonial wow fadeInLeft"
                  {...(item.delay && { "data-wow-delay": item.delay })}
                >
                  <div className="content">
                    <div className="content-top">
                      <div className="box-author">
                        <p className="name-author text-sm fw-medium">
                          {item.name}
                        </p>
                        <div className="box-verified text-main">
                          <i className="icon-verifi" />
                          <p className="text-xs fst-italic">
                            Người mua đã xác minh
                          </p>
                        </div>
                      </div>

                      <div className="list-star-default">
                        {Array(5)
                          .fill(null)
                          .map((_, i) => (
                            <i key={i} className="icon-star" />
                          ))}
                      </div>

                      <p className="text-review text-sm text-main">
                        {item.review}
                      </p>
                    </div>

                    <span className="br-line d-block" />

                    <div className="box-avt">
                      <div className="avatar">
                        <img
                          alt="author"
                          src={item.image || "/placeholder.jpg"}
                          width={128}
                          height={128}
                        />
                      </div>

                      <div className="box-price">
                        <p className="name-item text-xs">
                          Mặt hàng đã mua:{" "}
                          <a
                            href="#"
                            className="fw-medium text-sm link text-line-clamp-1"
                          >
                            {item.product}
                          </a>
                        </p>
                        <p className="price text-md fw-medium">$150.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <span className="sw-dot-default sw-pagination-tes justify-content-center" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
