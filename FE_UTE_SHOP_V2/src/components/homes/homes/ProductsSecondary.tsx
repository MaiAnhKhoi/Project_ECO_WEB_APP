"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import productApi from "@/services/productApi";
import type { Product } from "@/types/product";

export default function ProductsSecondary() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayPicks = async () => {
      try {
        // Gọi API Today’s Picks
        const res = await productApi.getTodayPicks(10);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Không tải được Gợi ý hôm nay");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayPicks();
  }, []);

  return (
    <section className="flat-spacing-3 pt-0 overflow-hidden">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Gợi ý hôm nay</h4>
        </div>

        <div className="fl-control-sw2 pos2 wow fadeInUp">
          <Swiper
            dir="ltr"
            className="swiper tf-swiper wrap-sw-over"
            {...{
              slidesPerView: 2,
              spaceBetween: 12,
              speed: 800,
              observer: true,
              observeParents: true,
              slidesPerGroup: 2,
              navigation: {
                clickable: true,
                nextEl: ".nav-next-top-pick",
                prevEl: ".nav-prev-top-pick",
              } as any,
              pagination: {
                el: ".sw-pagination-top-pick",
                clickable: true,
              },
              breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
                1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
              },
            }}
            modules={[Pagination, Navigation]}
          >
            {/* Loading */}
            {loading && (
              <SwiperSlide>
                <div className="text-center py-5">Đang tải...</div>
              </SwiperSlide>
            )}

            {/* Error */}
            {!loading && error && (
              <SwiperSlide>
                <div className="text-danger py-5">{error}</div>
              </SwiperSlide>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              products.map((product, i) => (
                <SwiperSlide key={i}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}

            <div className="d-flex d-xl-none sw-dot-default sw-pagination-top-pick justify-content-center" />
          </Swiper>

          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-top-pick" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-top-pick" />
        </div>
      </div>
    </section>
  );
}
