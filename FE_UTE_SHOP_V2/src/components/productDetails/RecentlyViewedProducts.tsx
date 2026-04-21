// src/components/productDetails/RecentlyViewedProducts.tsx
"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import ProductCard from "../productCards/ProductCard";
import type { Product } from "@/types/product";

const RECENTLY_VIEWED_KEY = "recently_viewed_products";

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (!raw) return;

      const list: Product[] = JSON.parse(raw);

      // Nếu đang ở trang chi tiết, sản phẩm hiện tại cũng nằm trong list (ở đầu),
      // tuỳ bạn muốn giữ hay filter bỏ sản phẩm hiện tại:
      setProducts(list);
    } catch (e) {
      console.error("Failed to load recently viewed products", e);
    }
  }, []);

  // Nếu chưa có sản phẩm nào từng xem, ẩn luôn section
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Đã xem gần đây</h4>
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
              nextEl: ".nav-next-viewed",
              prevEl: ".nav-prev-viewed",
            }}
            pagination={{ el: ".sw-pagination-viewed", clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
              1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
            }}
            modules={[Pagination, Navigation]}
          >
            {products.map((product) => (
              <SwiperSlide className="swiper-slide" key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-viewed justify-content-center" />
          </Swiper>
          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-viewed" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-viewed" />
        </div>
      </div>
    </section>
  );
}
