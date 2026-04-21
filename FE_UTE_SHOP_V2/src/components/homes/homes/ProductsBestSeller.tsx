"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import productApi from "@/services/productApi";
import type { Product } from "@/types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await productApi.getBestSellers(10);
        setProducts(data.data);
      } catch (error) {
        console.error("Lỗi khi load Bán Chạy Nhất:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="flat-spacing-3 overflow-hidden">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Bán Chạy Nhất</h4>
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
                nextEl: ".nav-next-seller",
                prevEl: ".nav-prev-seller",
              } as any,
              pagination: { el: ".sw-pagination-seller", clickable: true },
              breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
                1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
              },
            }}
          >
            {/* Loading giữ nguyên cấu trúc Swiper */}
            {loading && (
              <SwiperSlide className="swiper-slide">
                <div className="text-center py-5">Đang tải...</div>
              </SwiperSlide>
            )}

            {!loading &&
              products.map((product) => (
                <SwiperSlide className="swiper-slide" key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}

            <div className="d-flex d-xl-none sw-dot-default sw-pagination-seller justify-content-center mt_5" />
          </Swiper>

          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-seller" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-seller" />
        </div>
      </div>
    </section>
  );
}
