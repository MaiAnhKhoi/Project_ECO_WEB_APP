"use client";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import blogApi, { BlogCategory } from "@/services/blogApi";

export default function Collections() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getActiveCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flat-spacing-24 pb-0">
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flat-spacing-24 pb-0">
      <div className="container">
        <Swiper
          dir="ltr"
          className="swiper tf-swiper hover-sw-nav wow fadeInUp"
          {...{
            slidesPerView: 2,
            spaceBetween: 12,
            speed: 800,
            observer: true,
            observeParents: true,
            slidesPerGroup: 2,
            navigation: {
              clickable: true,
              nextEl: ".nav-next-cls",
              prevEl: ".nav-prev-cls",
            } as any,
            pagination: { el: ".sw-pagination-cls", clickable: true },
            breakpoints: {
              768: { slidesPerView: 3, spaceBetween: 20, slidesPerGroup: 3 },
              1200: { slidesPerView: 5, spaceBetween: 20, slidesPerGroup: 3 },
            },
          }}
          modules={[Pagination, Navigation]}
        >
          {categories.map((category) => (
            <SwiperSlide className="swiper-slide" key={category.id}>
              <div className="wg-cls style-abs2 hover-img">
                <Link
                  to={`/blog-category/${category.slug}`}
                  className="image-wrap relative"
                >
                  <div className="image img-style">
                    <img
                      src={category.imageUrl || "/images/blog/default-category.jpg"}
                      alt={category.name}
                      className="lazyload"
                      width={408}
                      height={408}
                    />
                  </div>
                  <div className="cls-btn text-center">
                    <button className="tf-btn btn-white hover-dark">
                      Xem tất cả
                    </button>
                  </div>
                  <span className="tf-overlay" />
                </Link>
                <div className="cls-content text-center">
                  <Link
                    to={`/blog-category/${category.slug}`}
                    className="text-type text-xl-2 fw-medium link"
                  >
                    {category.name}
                  </Link>
                  <span className="count-item body-text-2 text-main">
                    {category.blogCount || 0} bài viết
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="d-flex d-xl-none sw-dot-default sw-pagination-category justify-content-center" />
        </Swiper>
      </div>
    </div>
  );
}
