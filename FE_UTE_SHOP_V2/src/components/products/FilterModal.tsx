"use client";

import { useEffect, useState } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";
import type { FilterModalProps } from "@/types";
import filterApi from "@/services/filterApi";
import { FilterResponse } from "@/types/filter";
import { resolveColorHex, isLightColorHex } from "@/utils/color";

export default function FilterModal({
  allProps,
  filters: filtersProp,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterResponse | null>(filtersProp ?? null);

  useEffect(() => {
    if (filtersProp) {
      setFilters(filtersProp);
      return;
    }

    filterApi.getGlobalFilters().then((res) => {
      setFilters(res.data);
      allProps.setPrice([Number(res.data.price.min), Number(res.data.price.max)]);
    });
  }, [filtersProp]);

  if (!filters) return null; // tránh lỗi khi API chưa load

  return (
<div
  className="offcanvas offcanvas-start canvas-sidebar canvas-filter"
  id="filterShop"
>
  <div className="canvas-wrapper">
    <div className="canvas-header">
      <span className="title">Bộ lọc</span>
      <button
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Đóng"
      />
    </div>

    <div className="canvas-body">

      {/* ==================== DANH MỤC ==================== */}
      <div className="widget-facet">
        <ul className="list-categories current-scrollbar">
          {filters.categories.map((item) => (
            <li key={item.id} className="cate-item">
              <Link className="text-sm link" to={`/shop-default?category=${item.slug}`}>
                <span>{item.name}</span>
                <span className="count">({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ==================== TÌNH TRẠNG ==================== */}
      <div className="widget-facet">
        <div
          className="facet-title text-xl fw-medium"
          data-bs-target="#availability"
          role="button"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="availability"
        >
          <span>Tình trạng</span>
          <span className="icon icon-arrow-up" />
        </div>

        <div id="availability" className="collapse show">
          <ul className="collapse-body filter-group-check current-scrollbar">
            <li className="list-item" onClick={() => allProps.setAvailability(true)}>
              <input
                type="radio"
                name="availability"
                className="tf-check"
                readOnly
                checked={allProps.availability == true}
              />
              <label className="label">
                <span>Còn hàng</span>
                &nbsp;<span className="count">({filters.availability.inStock})</span>
              </label>
            </li>

            <li className="list-item" onClick={() => allProps.setAvailability(false)}>
              <input
                type="radio"
                name="availability"
                className="tf-check"
                readOnly
                checked={allProps.availability == false}
              />
              <label className="label">
                <span>Hết hàng</span>
                &nbsp;<span className="count">({filters.availability.outOfStock})</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      {/* ==================== GIÁ ==================== */}
      <div className="widget-facet">
        <div
          className="facet-title text-xl fw-medium"
          data-bs-target="#price"
          role="button"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="price"
        >
          <span>Giá</span>
          <span className="icon icon-arrow-up" />
        </div>

        <div id="price" className="collapse show">
          <div className="collapse-body widget-price filter-price">
            <Slider
              value={allProps.price}
              onChange={(value) => allProps.setPrice(value as number[])}
              range
              min={filters.price.min}
              max={filters.price.max}
            />

            <div className="box-value-price">
              <span className="text-sm">Khoảng giá:</span>
              <div className="price-box">
                <div className="price-val">{allProps.price[0]}</div>
                <span>-</span>
                <div className="price-val">{allProps.price[1]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MÀU SẮC ==================== */}
      <div className="widget-facet">
        <div
          className="facet-title text-xl fw-medium"
          data-bs-target="#color"
          role="button"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="color"
        >
          <span>Màu sắc</span>
          <span className="icon icon-arrow-up" />
        </div>

        <div id="color" className="collapse show">
          <div className="collapse-body filter-color-box flat-check-list">
            {filters.colors.map((item) => {
              const swatchHex = resolveColorHex({
                hex: item.hex ?? null,
                cssClass: item.cssClass ?? null,
                fallbackName: item.name,
              });
              const light = isLightColorHex(swatchHex);
              return (
                <div
                  key={item.id}
                  className={`check-item color-item color-check ${
                    allProps.color === item.name ? "active" : ""
                  }`}
                  onClick={() => allProps.setColor(item.name)}
                >
                  <span
                    className={`color ${light ? "line" : ""}`}
                    style={{ backgroundColor: swatchHex }}
                  />
                  <span className="color-text">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== KÍCH THƯỚC ==================== */}
      <div className="widget-facet">
        <div
          className="facet-title text-xl fw-medium"
          data-bs-target="#size"
          role="button"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="size"
        >
          <span>Kích thước</span>
          <span className="icon icon-arrow-up" />
        </div>

        <div id="size" className="collapse show">
          <div className="collapse-body filter-size-box flat-check-list">
            {filters.sizes.map((item) => (
              <div
                key={item.size}
                onClick={() => allProps.setSize(item.size)}
                className={`check-item size-item size-check ${
                  item.size === allProps.size ? "active" : ""
                }`}
              >
                <span className="size">{item.size}</span>
                <span className="count">({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== THƯƠNG HIỆU ==================== */}
      <div className="widget-facet">
        <div
          className="facet-title text-xl fw-medium"
          data-bs-target="#brand"
          role="button"
          data-bs-toggle="collapse"
          aria-expanded="true"
          aria-controls="brand"
        >
          <span>Thương hiệu</span>
          <span className="icon icon-arrow-up" />
        </div>

        <div id="brand" className="collapse show">
          <ul className="collapse-body filter-group-check current-scrollbar">
            {filters.brands.map((brand) => (
              <li
                key={brand.id}
                className="list-item"
                onClick={() => allProps.setBrands(brand.name)}
              >
                <input
                  type="radio"
                  className="tf-check"
                  readOnly
                  checked={
                    typeof allProps.brands === "string"
                      ? allProps.brands === brand.name
                      : Array.isArray(allProps.brands)
                      ? allProps.brands.includes(brand.name)
                      : false
                  }
                />
                <label className="label">
                  <span>{brand.name}</span>
                  <span className="count">({brand.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  </div>
</div>

  );
}
