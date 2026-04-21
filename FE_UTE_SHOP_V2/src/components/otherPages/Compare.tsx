"use client";
import { useContextElement } from "@/context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import productApi from "@/services/productApi";
import { formatPrice } from "@/utils/formatPrice";
import { getShopName } from "@/config/shop";

export default function Compare() {
  const {
    compareItem,
    removeFromCompareItem,
    clearCompare,
    addProductToCart,
  } = useContextElement();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (compareItem.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productPromises = compareItem.map((id) =>
          productApi
            .getProductDetail(id)
            .then((res) => res.data)
            .catch(() => null),
        );
        const products = (await Promise.all(productPromises)).filter(
          (p) => p !== null,
        ) as Product[];
        setItems(products);
      } catch (error) {
        console.error("Không thể tải danh sách sản phẩm so sánh:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [compareItem]);

  if (loading) {
    return (
      <section className="flat-spacing-15 pt-0">
        <div className="container">
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải danh sách so sánh...</p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flat-spacing-15 pt-0">
        <div className="container">
          <div className="text-center p-5">
            <h4 className="mb-3">Chưa có sản phẩm nào để so sánh</h4>
            <p className="text-muted mb-4">
              Thêm sản phẩm vào danh sách so sánh để xem chi tiết.
            </p>
            <Link to="/shop-default" className="tf-btn animate-btn">
              Duyệt sản phẩm
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const getAttributeValue = (product: Product, key: string): string => {
    switch (key) {
      case "price":
        return formatPrice(product.price);
      case "oldPrice":
        return product.oldPrice ? formatPrice(product.oldPrice) : "-";
      case "material":
        return (product as any).material || "-";
      case "origin":
        return (product as any).countryOfOrigin || "-";
      case "brand":
        return (product as any).brandName || "-";
      default:
        return "-";
    }
  };

  const attributeRows = [
    { key: "price", label: "Giá hiện tại" },
    { key: "oldPrice", label: "Giá trước đây" },
    { key: "material", label: "Chất liệu" },
    { key: "origin", label: "Xuất xứ" },
    { key: "brand", label: "Thương hiệu" },
  ];

  return (
    <section className="flat-spacing-15 pt-0">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">So sánh sản phẩm</h4>
          <button
            className="tf-btn btn-out-line-dark2"
            type="button"
            onClick={() => clearCompare()}
          >
            Xóa tất cả
          </button>
        </div>

        <div className="tf-compare-table">
          {/* Hàng đầu tiên: thẻ sản phẩm */}
          <div className="tf-compare-row tf-compare-grid">
            <div className="tf-compare-col d-md-block d-none" />
            {items.map((product) => (
              <div className="tf-compare-col" key={product.id}>
                <div className="tf-compare-item">
                  <Link
                    className="tf-compare-image"
                    to={`/product-detail/${product.id}`}
                  >
                    <img
                      className="lazyload"
                      src={product.imgSrc}
                      alt={product.title}
                      width={320}
                      height={407}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </Link>
                  <div className="content">
                    <Link
                      className="tf-compare-title link text-md fw-medium"
                      to={`/product-detail/${product.id}`}
                    >
                      {product.title}
                    </Link>
                    <p className="price-wrap fw-medium text-md">
                      <span className="price-new text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="price-old text-dark">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </p>
                    <div className="tf-compare-btn">
                      <button
                        type="button"
                        className="tf-btn animate-btn w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addProductToCart(product.id, 1, true);
                        }}
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                  <div className="tf-compare-remove">
                    <button
                      type="button"
                      className="tf-btn-icon line d-inline-flex border-0 bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromCompareItem(product.id);
                      }}
                      aria-label="Xóa sản phẩm khỏi danh sách so sánh"
                    >
                      <i className="icon-close" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hàng: Tình trạng */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Tình trạng</p>
            </div>
            {items.map((product) => (
              <div
                key={`status-${product.id}`}
                className={`tf-compare-col tf-compare-field tf-compare-stock ${
                  product.inStock ? "" : "text-red"
                }`}
              >
                <div className="icon">
                  {product.inStock ? (
                    <i className="icon-fill-check-circle" />
                  ) : (
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1_34903)">
                        <path
                          d="M7.5 14.4955C11.366 14.4955 14.5 11.3635 14.5 7.50004C14.5 3.63659 11.366 0.504639 7.5 0.504639C3.63401 0.504639 0.5 3.63659 0.5 7.50004C0.5 11.3635 3.63401 14.4955 7.5 14.4955Z"
                          fill="#E21B1B"
                        />
                        <path
                          d="M5.28008 4.19648L4.19751 5.27905L9.72085 10.8024L10.8034 9.71982L5.28008 4.19648Z"
                          fill="white"
                        />
                        <path
                          d="M9.72036 4.19602L4.19702 9.71936L5.27959 10.8019L10.8029 5.27859L9.72036 4.19602Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_34903">
                          <rect
                            width={14}
                            height={14}
                            fill="white"
                            transform="translate(0.5 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                </div>
                <span>{product.inStock ? "Còn hàng" : "Hết hàng"}</span>
              </div>
            ))}
          </div>

          {/* Hàng: Nhà bán hàng */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Nhà bán hàng</p>
            </div>
            {items.map((product) => (
              <div
                key={`vendor-${product.id}`}
                className="tf-compare-col tf-compare-value text-center"
              >
                <p className="text-sm">{getShopName()}</p>
              </div>
            ))}
          </div>

          {/* Các hàng thuộc tính khác */}
          {attributeRows.map((attr) => (
            <div className="tf-compare-row" key={attr.key}>
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <p className="text-md fw-medium">{attr.label}</p>
              </div>
              {items.map((product) => (
                <div
                  key={`${attr.key}-${product.id}`}
                  className="tf-compare-col tf-compare-value text-center"
                >
                  <p className="text-sm">
                    {getAttributeValue(product, attr.key)}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Hàng: Màu sắc */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Màu sắc</p>
            </div>
            {items.map((product) => (
              <div
                key={`color-${product.id}`}
                className="tf-compare-col tf-compare-value text-center"
              >
                <p className="text-sm">
                  {(product as any).colorNames ||
                    (product as any).color ||
                    "Đen, Trắng, Xanh navy"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
