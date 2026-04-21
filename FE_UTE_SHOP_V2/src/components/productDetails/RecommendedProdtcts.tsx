"use client";
import { products37 } from "@/data/products";
import ProductCard from "../productCards/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function RecommendedProdtcts() {
  return (
    <section>
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">People Also Bought</h4>
        </div>
        <div className="hover-sw-nav hover-sw-2 wow fadeInUp">
          <Swiper
            dir="ltr"
            className="swiper tf-swiper wrap-sw-over"
            slidesPerView={2}
            spaceBetween={12}
            speed={800}
            observer={true}
            observeParents={true}
            slidesPerGroup={2}
            navigation={{
              nextEl: ".nav-next-bought",
              prevEl: ".nav-prev-bought",
            }}
            pagination={{ el: ".sw-pagination-bought", clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
              1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
            }}
            modules={[Pagination, Navigation]}
          >
            {products37.map((product) => (
              <SwiperSlide className="swiper-slide" key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-bought justify-content-center" />
          </Swiper>
          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-bought" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-bought" />
        </div>
      </div>
    </section>
  );
}
