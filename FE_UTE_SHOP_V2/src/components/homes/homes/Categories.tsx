"use client";

import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import categoryApi from "@/services/categoryApi";
import type { CategoryItem } from "@/types/category";

export default function Categories() {
  const [roots, setRoots] = useState<CategoryItem[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<number, CategoryItem[]>>({});
  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      // 1) Load ROOT CATEGORIES (Men, Women,…)
      const rootRes = await categoryApi.getRootCategories();
      const rootList = rootRes.data;

      setRoots(rootList);

      if (rootList.length > 0) {
        setActiveTab(rootList[0].id); // Tab đầu tiên active

        // 2) Load children của từng root
        const map: Record<number, CategoryItem[]> = {};
        for (const r of rootList) {
          const children = await categoryApi.getChildrenByParentId(r.id);
          map[r.id] = children.data;
        }

        setChildrenMap(map);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="flat-spacing-3">
      <div className="container">
        <div className="flat-animate-tab">
          <div className="flat-title-tab-categories text-center">
            <h4 className="title">Danh mục</h4>

            {/* 🟦 Dynamic Tabs */}
            <ul className="menu-tab-line justify-content-center" role="tablist">
              {roots.map((root) => (
                <li
                  key={root.id}
                  className="nav-tab-item"
                  role="presentation"
                  onClick={() => setActiveTab(root.id)}
                >
                  <a
                    href={`#root-${root.id}`}
                    className={`tab-link ${activeTab === root.id ? "active" : ""}`}
                    data-bs-toggle="tab"
                  >
                    {root.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 🟩 Tab Panels */}
          <div className="tab-content">
            {roots.map((root) => (
              <div
                key={root.id}
                className={`tab-pane ${activeTab === root.id ? "active show" : ""}`}
                id={`root-${root.id}`}
                role="tabpanel"
              >
                <Swiper
                  dir="ltr"
                  className="swiper tf-swiper"
                  modules={[Pagination, Navigation]}
                  {...{
                    slidesPerView: 2,
                    spaceBetween: 12,
                    speed: 800,
                    observer: true,
                    observeParents: true,
                    slidesPerGroup: 2,
                    navigation: {
                      clickable: true,
                      nextEl: `.nav-next-${root.id}`,
                      prevEl: `.nav-prev-${root.id}`,
                    } as any,
                    pagination: { el: `.sw-pagination-${root.id}`, clickable: true },
                    breakpoints: {
                      575: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
                      768: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
                      1200: { slidesPerView: 6, spaceBetween: 64, slidesPerGroup: 6 },
                    },
                  }}
                >
                  {(childrenMap[root.id] || []).map((item) => (
                    <SwiperSlide className="swiper-slide" key={item.id}>
                      <div className="wg-cls style-circle hover-img">
                        <Link
                          to={`/shop-default?category=${item.slug}`}
                          className="image img-style d-block"
                        >
                          <img
                            src={item.imageUrl || "/images/placeholder.jpg"}
                            alt={item.name}
                            className="lazyload"
                            width={300}
                            height={300}
                          />
                        </Link>
                        <div className="cls-content text-center">
                          <Link
                            to={`/shop-default?category=${item.slug}`}
                            className="link text-md fw-medium"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}

                  <span
                    className={`d-flex d-xl-none sw-dot-default sw-pagination-${root.id} justify-content-center`}
                  />
                </Swiper>

                {/* Navigation buttons */}
                <div className={`d-none d-xl-flex swiper-button-next nav-swiper nav-next-${root.id}`} />
                <div className={`d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-${root.id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
