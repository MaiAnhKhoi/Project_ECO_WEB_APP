"use client";

import { useMemo } from "react";
import ProductCard from "@/components/productCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useTrending } from "@/features/ai/hooks/useRecommendations";
import { mapSuggestionToProduct } from "@/features/ai/utils/mapSuggestionToProduct";

/**
 * Xu hướng hôm nay — cùng layout & ProductCard với "Phổ biến nhất", nguồn AI trending API.
 */
export default function ProductsTrendingSection() {
  const { data, isLoading, isError } = useTrending(10);

  const products = useMemo(
    () => (data?.products ?? []).map(mapSuggestionToProduct),
    [data?.products]
  );

  if (isError) return null;

  if (isLoading) {
    return (
      <section className="flat-spacing-3 overflow-hidden">
        <div className="container">
          <div className="flat-title wow fadeInUp">
            <h4 className="title">Xu hướng hôm nay</h4>
          </div>
          <p>Đang tải sản phẩm…</p>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="flat-spacing-3 overflow-hidden">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Xu hướng hôm nay</h4>
        </div>
        <div className="fl-control-sw2 pos2 wow fadeInUp">
          <Swiper
            dir="ltr"
            className="swiper tf-swiper wrap-sw-over"
            modules={[Pagination, Navigation]}
            {...{
              slidesPerView: 2,
              spaceBetween: 12,
              speed: 800,
              slidesPerGroup: 2,
              navigation: {
                clickable: true,
                nextEl: ".nav-next-trending",
                prevEl: ".nav-prev-trending",
              } as any,
              pagination: { el: ".sw-pagination-trending", clickable: true },
              breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                  slidesPerGroup: 4,
                },
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide className="swiper-slide" key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-trending justify-content-center mt_5" />
          </Swiper>
          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-trending" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-trending" />
        </div>
      </div>
    </section>
  );
}
