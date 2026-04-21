"use client";

import ListProducts from "./ListProducts";
import GridProducts from "./GridProducts";
import FilterModal from "./FilterModal";
import LayoutHandler from "./LayoutHandler";
import { useEffect, useReducer, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { initialState, reducer } from "@/reducer/filterReducer";

import type { ProductsProps } from "@/types";
import productApi from "@/services/productApi";
import filterApi from "@/services/filterApi";
import type { FilterResponse } from "@/types/filter";

export default function Products({
  fullWidth = false,
  cardStyleClass,
  tooltipDirection,
  parentClass = "flat-spacing-24",
}: ProductsProps) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // phân trang từ BE
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Đọc category & brand từ query string (?category=slug&brand=Brand+Name)
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const brandFromQuery = searchParams.get("brand") ? decodeURIComponent(searchParams.get("brand")!) : null;

  // FILTER từ BE
  const [filters, setFilters] = useState<FilterResponse | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const {
    price,
    availability,
    color,
    size,
    brands,
    filtered,
    sorted,
    sortingOption,
    currentPage,
    itemPerPage,
  } = state as any;

  // =========================
  //     FILTER ACTIONS
  // =========================
  const allProps = {
    ...state,
    setPrice: (value: number[]) =>
      dispatch({ type: "SET_PRICE", payload: value }),

    setColor: (value: string) => {
      value === color
        ? dispatch({ type: "SET_COLOR", payload: "All" })
        : dispatch({ type: "SET_COLOR", payload: value });
    },
    setSize: (value: string) => {
      value === size
        ? dispatch({ type: "SET_SIZE", payload: "All" })
        : dispatch({ type: "SET_SIZE", payload: value });
    },
    setAvailability: (value: "All" | boolean) => {
      dispatch({
        type: "SET_AVAILABILITY",
        payload: value,
      } as any);
    },

    setBrands: (newBrand: string) => {
      // Khi đổi thương hiệu thì luôn quay về trang 1
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_BRANDS", payload: newBrand });
    },
    removeBrand: (newBrand: string) => {
      const updated =
        brands === "All"
          ? []
          : (typeof brands === "string" ? [brands] : brands
            ).filter((brand: string) => brand !== newBrand);

      dispatch({
        type: "SET_BRANDS",
        payload: updated.length > 0 ? updated : "All",
      });
    },

    setSortingOption: (value: string) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),

    setCurrentPage: (value: number) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),

    setItemPerPage: (value: number) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },

    clearFilter: () => {
      dispatch({ type: "CLEAR_FILTER" });

      // reset price theo BE nếu có
      if (filters?.price) {
        dispatch({
          type: "SET_PRICE",
          payload: [
            Number(filters.price.min),
            Number(filters.price.max),
          ],
        });
      }

      // Xóa category/brand trên URL
      const params = new URLSearchParams(searchParams);
      params.delete("category");
      params.delete("brand");
      navigate({
        pathname: "/shop-default",
        search: params.toString() ? `?${params.toString()}` : "",
      });
    },
  };

  // =========================
  //     LOAD FILTER FROM BE
  // =========================
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFilterLoading(true);
        const res = await filterApi.getGlobalFilters();
        const data = res.data;
        setFilters(data);

        // set default price range từ BE
        if (data.price) {
          dispatch({
            type: "SET_PRICE",
            payload: [
              Number(data.price.min),
              Number(data.price.max),
            ],
          });
        }

        // Nếu có brand trên query (?brand=BrandName) thì set luôn filter brand tương ứng
        if (brandFromQuery && data.brands && data.brands.length > 0) {
          const matchedBrand = data.brands.find(
            (b: any) => b.name.toLowerCase() === brandFromQuery.toLowerCase(),
          );
          if (matchedBrand) {
            dispatch({ type: "SET_BRANDS", payload: matchedBrand.name });
          }
        }
      } catch (error) {
        console.error("Failed to load filters", error);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilters();
  }, [brandFromQuery]);

  // =========================
  //     LOAD PRODUCTS (FILTERED)
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const pageIndex = (currentPage || 1) - 1;
      const sizePage = itemPerPage || 16;

      // Map tên thương hiệu đang chọn -> brandId (string) gửi cho BE
      let brandId: string | undefined = undefined;
      if (brands && brands !== "All" && filters?.brands) {
        const selectedNames =
          typeof brands === "string" ? [brands] : (brands as string[]);
        const matched = filters.brands.find((b) =>
          selectedNames.includes(b.name),
        );
        if (matched) {
          brandId = String(matched.id);
        }
      }

      const res = await productApi.getFiltered(pageIndex, sizePage, {
        price,
        availability,
        color,
        size,
        categories: categorySlug || undefined,
        brandIds: brandId,
        sortingOption,
      });

      const data = res.data;

      dispatch({ type: "SET_FILTERED", payload: data.content });
      dispatch({ type: "SET_SORTED", payload: data.content });

      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filters) return;
    fetchProducts();
  }, [
    filters,
    currentPage,
    itemPerPage,
    price,
    availability,
    color,
    size,
    brands,
    categorySlug,
    sortingOption,
  ]);

  // =========================
  //     SORT IN CURRENT PAGE (optional)
  // =========================
  useEffect(() => {
    if (!filtered) return;

    if (sortingOption === "Giá tăng dần") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a: any, b: any) => a.price - b.price),
      });
    } else if (sortingOption === "Giá giảm dần") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a: any, b: any) => b.price - a.price),
      });
    } else if (sortingOption === "Tên tăng dần") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a: any, b: any) =>
          (a.title || a.name || "").localeCompare(b.title || b.name || ""),
        ),
      });
    } else if (sortingOption === "Tên giảm dần") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a: any, b: any) =>
          (b.title || b.name || "").localeCompare(a.title || a.name || ""),
        ),
      });
    } else {
      dispatch({ type: "SET_SORTED", payload: filtered });
    }
  }, [filtered, sortingOption]);

  // =========================
  //   DEFAULT PRICE RANGE & FILTER FLAG
  // =========================
  const defaultPriceRange =
    filters?.price
      ? [Number(filters.price.min), Number(filters.price.max)]
      : [20, 300];

  const hasCustomPrice =
    price && price.join("-") !== defaultPriceRange.join("-");

  const hasAnyFilter =
    availability !== "All" ||
    brands !== "All" ||
    hasCustomPrice ||
    color !== "All" ||
    size !== "All" ||
    !!categorySlug;

  // =========================
  //     PAGINATION RENDER (GIỮ FORMAT CŨ)
  // =========================
  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <ul className="wg-pagination">
        {pages.map((page) => (
          <li key={page} className={page === currentPage ? "active" : ""}>
            {page === currentPage ? (
              <div className="pagination-item">{page}</div>
            ) : (
              <a
                href="#"
                className="pagination-item"
                onClick={(e) => {
                  e.preventDefault();
                  allProps.setCurrentPage(page);
                }}
              >
                {page}
              </a>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <a
              href="#"
              className="pagination-item"
              onClick={(e) => {
                e.preventDefault();
                allProps.setCurrentPage(currentPage + 1);
              }}
            >
              <i className="icon-arr-right2" />
            </a>
          </li>
        )}
      </ul>
    );
  };

  // =========================
  //          RENDER (GIỐNG FORMAT ĐẦU TIÊN)
  // =========================
  return (
    <>
      <section className={parentClass}>
        <div className={fullWidth ? "container-full" : "container"}>
          <div className="tf-shop-control">
            <div className="tf-group-filter">
              {/* Nút filter: giữ format <a> như bản đầu */}
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Bộ lọc</span>
              </a>

              {/* Sort dropdown: giữ cấu trúc cũ */}
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <div className="btn-select">
                  <span className="text-sort-value">
                    {sortingOption || "Sắp xếp (Mặc định)"}
                  </span>
                  <span className="icon icon-arr-down" />
                </div>
                <div className="dropdown-menu">
                  {[
                    "Sắp xếp (Mặc định)",
                    "Tên tăng dần",
                    "Tên giảm dần",
                    "Giá tăng dần",
                    "Giá giảm dần",
                  ].map((elm, i) => (
                    <div
                      key={i}
                      className={`select-item ${
                        sortingOption === elm ? "active" : ""
                      }`}
                      onClick={() => allProps.setSortingOption(elm)}
                    >
                      <span className="text-value-item">{elm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
              />
            </ul>
          </div>

          <div className="wrapper-control-shop">
            {hasAnyFilter && (
              <div className="meta-filter-shop">
                <div id="product-count-grid" className="count-text">
                  <span className="count">{totalElements}</span>
                  Sản phẩm{totalElements > 1 ? "" : ""} tìm thấy
                </div>

                <div id="applied-filters">
                  {categorySlug && (
                    <span
                      className="filter-tag"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete("category");
                        navigate({
                          pathname: "/shop-default",
                          search: params.toString()
                            ? `?${params.toString()}`
                            : "",
                        });
                        dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="remove-tag icon-close"></span>
                      Danh mục: {categorySlug}
                    </span>
                  )}

                  {availability !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setAvailability("All")}
                    >
                      <span className="remove-tag icon-close"></span>
                      Tình trạng: {availability ? "Còn hàng" : "Hết hàng"}
                    </span>
                  )}

                  {brands !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setBrands("All")}
                    >
                      <span className="remove-tag icon-close"></span>
                      Thương hiệu: {brands}
                    </span>
                  )}

                  {hasCustomPrice && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setPrice(defaultPriceRange)}
                    >
                      <span className="remove-tag icon-close"></span>
                      Giá: {price[0].toLocaleString("vi-VN")}₫ -{" "}
                      {price[1].toLocaleString("vi-VN")}₫
                    </span>
                  )}

                  {color !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setColor("All")}
                    >
                      <span className="remove-tag icon-close"></span>
                      Màu: {color}
                    </span>
                  )}

                  {size !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setSize("All")}
                    >
                      <span className="remove-tag icon-close"></span>
                      Kích thước: {size}
                    </span>
                  )}
                </div>

                <button
                  id="remove-all"
                  className="remove-all-filters"
                  onClick={allProps.clearFilter}
                >
                  <i className="icon icon-close" /> Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {loading || filterLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                Đang tải...
              </div>
            ) : activeLayout === 1 ? (
              <div className="tf-list-layout wrapper-shop" id="listLayout">
                <ListProducts products={sorted} />
                {renderPagination()}
              </div>
            ) : (
              <div
                className={`wrapper-shop tf-grid-layout tf-col-${activeLayout}`}
                id="gridLayout"
              >
                <GridProducts
                  cardStyleClass={cardStyleClass}
                  products={sorted}
                  tooltipDirection={tooltipDirection}
                />
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} filters={filters} />
    </>
  );
}
