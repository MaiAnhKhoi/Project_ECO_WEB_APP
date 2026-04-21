"use client";

import { useState, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../productCards/ProductCard";
import productApi from "@/services/productApi";

type TabType = "featured" | "trending" | "new" | "sale";

export default function SearchModal() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  // 🔥 Load sản phẩm theo tab khi component mount hoặc tab thay đổi
  useEffect(() => {
    if (keyword.length < 2) {
      loadTabProducts(activeTab);
    }
  }, [activeTab]);

  // 🔥 Debounce search (delay 300ms)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword.trim().length > 1) {
        search(keyword);
      } else {
        setResults([]);
        // Khi xóa keyword, load lại tab products
        loadTabProducts(activeTab);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword, activeTab]);

  // 🚀 Load sản phẩm theo tab
  const loadTabProducts = async (tab: TabType) => {
    try {
      setTabLoading(true);
      let res;
      
      switch (tab) {
        case "featured":
          res = await productApi.getFeaturedProducts(12);
          break;
        case "trending":
          res = await productApi.getMostPopular(12);
          break;
        case "new":
          res = await productApi.getNewArrivals(12);
          break;
        case "sale":
          res = await productApi.getBestDeals(12);
          break;
        default:
          res = await productApi.getFeaturedProducts(12);
      }
      
      setProducts(res.data || []);
    } catch (err) {
      console.error(`Failed to load ${tab} products:`, err);
      setProducts([]);
    } finally {
      setTabLoading(false);
    }
  };

  // 🚀 Call search API
  const search = async (text: string) => {
    try {
      setLoading(true);

      const res = await productApi.searchProducts(text, 0, 12);
      setResults(res.data?.content || []);

    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (keyword.trim().length > 1) search(keyword);
  };

  // Xử lý khi click tab
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setKeyword(""); // Reset keyword khi chuyển tab
    setResults([]);
  };

  return (
    <div className="modal popup-search fade" id="search">
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="header">
            <button
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="container">
            <div className="row justify-content-center">

              {/* Search Box */}
              <div className="col-lg-8">
                <div className="looking-for-wrap">
                  <div className="heading">Bạn muốn tìm gì?</div>

                  <form className="form-search" onSubmit={onSubmit}>
                    <fieldset className="text">
                      <input
                        type="text"
                        placeholder="Nhập từ khóa tìm kiếm..."
                        className=""
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        required
                      />
                    </fieldset>
                    <button type="submit">
                      <i className="icon icon-search" />
                    </button>
                  </form>

                  {/* Popular searches - chuyển thành tabs */}
                  <div className="popular-searches justify-content-md-center">
                    <div className="text fw-medium">Tìm kiếm phổ biến:</div>
                    <ul>
                      <li>
                        <span
                          onClick={() => handleTabClick("featured")}
                          className={`link ${activeTab === "featured" ? "active" : ""}`}
                        >
                          Nổi bật
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => handleTabClick("trending")}
                          className={`link ${activeTab === "trending" ? "active" : ""}`}
                        >
                          Thịnh hành
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => handleTabClick("new")}
                          className={`link ${activeTab === "new" ? "active" : ""}`}
                        >
                          Mới nhất
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => handleTabClick("sale")}
                          className={`link ${activeTab === "sale" ? "active" : ""}`}
                        >
                          Khuyến mãi
                        </span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Results */}
              <div className="col-lg-10">
                <div className="featured-product">
                  <div className="text-xl-2 fw-medium featured-product-heading">
                    {keyword.length >= 2
                      ? loading
                        ? "Đang tìm kiếm..."
                        : `Kết quả cho "${keyword}":`
                      : activeTab === "featured"
                      ? "Sản phẩm nổi bật"
                      : activeTab === "trending"
                      ? "Sản phẩm thịnh hành"
                      : activeTab === "new"
                      ? "Sản phẩm mới nhất"
                      : "Sản phẩm khuyến mãi"}
                  </div>

                  <Swiper
                    dir="ltr"
                    className="swiper tf-swiper wrap-sw-over"
                    {...{
                      slidesPerView: 2,
                      spaceBetween: 12,
                      speed: 1000,
                      observer: true,
                      observeParents: true,
                      slidesPerGroup: 2,
                      pagination: {
                        el: ".sw-pagination-search",
                        clickable: true,
                      },
                      breakpoints: {
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 12,
                          slidesPerGroup: 3,
                        },
                        1200: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                          slidesPerGroup: 4,
                        },
                      },
                    }}
                    modules={[Pagination]}
                  >
                    {(keyword.length >= 2 ? results : products).map((product, i) => (
                      <SwiperSlide key={product.id || i}>
                        <ProductCard product={product} />
                      </SwiperSlide>
                    ))}

                    {keyword.length < 2 && products.length === 0 && !tabLoading && (
                      <div className="text-center py-4">
                        <p className="text-muted">
                          {activeTab === "featured"
                            ? "Chưa có sản phẩm nổi bật"
                            : activeTab === "trending"
                            ? "Chưa có sản phẩm thịnh hành"
                            : activeTab === "new"
                            ? "Chưa có sản phẩm mới"
                            : "Chưa có sản phẩm khuyến mãi"}
                        </p>
                      </div>
                    )}

                    {keyword.length < 2 && tabLoading && (
                      <div className="text-center py-4">
                        <p className="text-muted">Đang tải sản phẩm...</p>
                      </div>
                    )}

                    {keyword.length >= 2 && results.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p className="text-muted">Không tìm thấy sản phẩm nào</p>
                      </div>
                    )}

                    <div className="d-flex d-xl-none sw-dot-default sw-pagination-search justify-content-center" />
                  </Swiper>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
