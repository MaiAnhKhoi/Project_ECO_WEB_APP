"use client";
import { useContextElement } from "@/context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import productApi from "@/services/productApi";
import { formatPrice } from "@/utils/formatPrice";

export default function Compare() {
  const { removeFromCompareItem, compareItem, clearCompare } =
    useContextElement();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      // Nếu không có gì để so sánh
      if (!compareItem || compareItem.length === 0) {
        if (isMounted) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        // Lấy chi tiết từng sản phẩm theo id trong compareItem
        const productPromises = compareItem.map((id) =>
          productApi
            .getProductDetail(id)
            .then((res) => res.data)
            .catch(() => null), // nếu 1 cái fail thì không làm hỏng cả mảng
        );

        const products = (await Promise.all(productPromises)).filter(
          (p) => p !== null,
        ) as Product[];

        if (isMounted) {
          setItems(products);
        }
      } catch (error) {
        console.error("Failed to fetch compare products:", error);
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [compareItem]);

  return (
    <div className="modal modalCentered fade modal-compare" id="compare">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-compare-wrap list-file-delete">
            <h6 className="title text-center">So sánh sản phẩm</h6>

            <div className="tf-compare-inner">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : items.length ? (
                <div className="tf-compare-list">
                  {items.map((product, i) => (
                    <div
                      key={product.id || i}
                      className="tf-compare-item file-delete"
                    >
                      <span
                        className="icon-close remove"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromCompareItem(product.id);
                        }}
                      />
                      <Link
                        to={`/product-detail/${product.id}`}
                        className="image"
                      >
                        <img
                          className="lazyload"
                          alt={product.title}
                          src={product.imgSrc}
                          width={1000}
                          height={1421}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      </Link>
                      <div className="content">
                        <div className="text-title">
                          <Link
                            className="link text-line-clamp-2"
                            to={`/product-detail/${product.id}`}
                          >
                            {product.title}
                          </Link>
                        </div>
                        <p className="price-wrap">
                          <span className="new-price text-primary">
                            {formatPrice(product.price)}
                          </span>{" "}
                          {product.oldPrice && (
                            <span className="old-price text-decoration-line-through text-dark-1">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tf-compare-inner">
                  <div className="text-center">
                    Chưa có sản phẩm nào trong danh sách so sánh.  
                    Hãy duyệt sản phẩm và thêm vào để so sánh.
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && !loading && (
              <div className="tf-compare-buttons justify-content-center">
                <Link
                  to={`/compare`}
                  className="tf-btn animate-btn justify-content-center"
                >
                  So sánh chi tiết
                </Link>
                <div
                  className="tf-btn btn-out-line-dark justify-content-center clear-file-delete cursor-pointer"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách so sánh?",
                      )
                    ) {
                      clearCompare();
                    }
                  }}
                >
                  <span>Xóa tất cả</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
