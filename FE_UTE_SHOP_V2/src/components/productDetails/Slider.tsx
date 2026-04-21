"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";

// @ts-ignore - drift-zoom doesn't have types
import Drift from "drift-zoom";

import type { SliderProps } from "@/types";

export default function Slider({
  activeColor = "",
  setActiveColor = () => {},
  firstItem,
  slideItems = [],
}: SliderProps) {

  // Clone lại để không mutate props
  const items = [...slideItems];

  // Ghi đè ảnh đầu tiên = ảnh chính từ API
  // if (items.length > 0 && firstItem) {
  //   items[0].imgSrc = firstItem;
  // }

  const [thumbSwiper, setThumbSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  // =============== ZOOM ===============
  useEffect(() => {
    if (window.innerWidth < 1200) return;

    const driftAll = document.querySelectorAll(".tf-image-zoom");
    const pane = document.querySelector(".tf-zoom-main");

    driftAll.forEach((el) => {
      new Drift(el, {
        zoomFactor: 2,
        paneContainer: pane,
        inlinePane: false,
        handleTouch: false,
        hoverBoundingBox: true,
        containInline: true,
      });
    });

    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event: Event) => {
      const parent = (event.target as HTMLElement).closest(".section-image-zoom");
      parent?.classList.add("zoom-active");
    };

    const handleMouseLeave = (event: Event) => {
      const parent = (event.target as HTMLElement).closest(".section-image-zoom");
      parent?.classList.remove("zoom-active");
    };

    zoomElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      zoomElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // =============== LIGHTBOX ===============
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
    };
  }, []);

  // =============== ĐỔI MÀU → ĐỔI ẢNH ===============
  useEffect(() => {
    const index = items.findIndex((x) => x.color === activeColor);
    if (index !== -1) {
      swiperRef.current?.slideTo(index);
    }
  }, [activeColor]);

  // =============== LẦN ĐẦU LOAD ===============
  useEffect(() => {
    setTimeout(() => {
      const index = items.findIndex((x) => x.color === activeColor);
      if (index !== -1) {
        swiperRef.current?.slideTo(index);
      }
    });
  }, []);

  // ================= VIEW ===================
  return (
    <>
      {/* THUMBNAILS */}
      <Swiper
        dir="ltr"
        className="swiper tf-product-media-thumbs other-image-zoom"
        slidesPerView={4}
        direction="vertical"
        onSwiper={(swiper: any) => setThumbSwiper(swiper)}
        modules={[Thumbs]}
        spaceBetween={8}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide stagger-item"
            data-color={item.color}
            data-size={item.size}
          >
            <div className="item">
              <img
                className="lazyload"
                src={item.imgSrc}
                data-src={item.imgSrc}
                alt="img-product"
                width={828}
                height={1241}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* MAIN SLIDER */}
<div className="flat-wrap-media-product">
  <Swiper
    modules={[Thumbs, Navigation]}
    dir="ltr"
    className="swiper tf-product-media-main"
    id="gallery-swiper-started"
    thumbs={thumbSwiper ? { swiper: thumbSwiper } : undefined}
    navigation={{
      prevEl: ".snbp1",
      nextEl: ".snbn1",
    }}
    onSwiper={(swiper: any) => (swiperRef.current = swiper)}
    onSlideChange={(swiper) => {
      const current = items[swiper.activeIndex];
      if (current) {
        setActiveIndex(swiper.activeIndex);
        setActiveColor(current.color);
      }
    }}
  >
    {items.map((item, i) => {
      // ⭐ nếu là màu đang chọn → dùng ảnh firstItem
      const img = item.color === activeColor ? firstItem : item.imgSrc;

      return (
        <SwiperSlide key={i} className="swiper-slide">
          <a
            href={img}
            target="_blank"
            className="item"
            data-pswp-width="552px"
            data-pswp-height="827px"
          >
            <img
              className="tf-image-zoom lazyload"
              data-zoom={img}
              src={img}
              data-src={img}
              alt="img-product"
              width={828}
              height={1241}
            />
          </a>
        </SwiperSlide>
      );
    })}
  </Swiper>

  <div className="swiper-button-next nav-swiper thumbs-next snbn1" />
  <div className="swiper-button-prev nav-swiper thumbs-prev snbp1" />
</div>

    </>
  );
}
