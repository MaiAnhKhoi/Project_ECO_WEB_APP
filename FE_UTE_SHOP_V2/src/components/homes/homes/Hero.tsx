"use client";

import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import bannersApi from "@/services/bannerApi";
import { BannerItem } from "@/types/banner";

export default function Hero() {
  const [slides, setSlides] = useState<BannerItem[]>([]);

  useEffect(() => {
    let mounted = true;

    bannersApi
      .getHomeBanners()
      .then((res) => {
        if (mounted) {
          setSlides(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load hero banners:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!slides.length) {
    // có thể return skeleton / null tuỳ bạn
    return null;
  }

  return (
    <section className="tf-slideshow slider-fashion-1 slider-default">
      <Swiper
        className="swiper tf-sw-slideshow slider-effect-fade"
        modules={[Autoplay, Pagination, EffectFade]}
        pagination={{
          clickable: true,
          el: ".spd1",
        }}
        effect="fade"
        loop
        speed={2000}
        dir="ltr"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className={`slider-wrap ${slide.bgType}`}>
              <div className="image">
                <img
                  src={slide.imageSrc}
                  alt="slider"
                  className="lazyload"
                  width={slide.width}
                  height={slide.height}
                />
              </div>
              <div className="box-content">
                <div className="container">
                  <div className="row">
                    <div className={slide.colClass}>
                      <div className="content-slider">
                        <div className="box-title-slider">
                          <h2
                            className="heading fw-medium fade-item fade-item-1 text-dark-5"
                            dangerouslySetInnerHTML={{ __html: slide.heading }}
                          />
                          <p className="sub text-md fade-item fade-item-2 text-dark-5">
                            {slide.subText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider justify-content-center spd1" />
          </div>
        </div>
      </Swiper>
    </section>
  );
}
