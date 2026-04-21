"use client";
import { useEffect, useState } from "react";
import ProductCard from "../productCards/ProductCard";
import { Link } from "react-router-dom";
import wishlistApi from "@/services/wishlistApi";
import { useContextElement } from "@/context/Context";
// nếu ProductCard nhận kiểu Product, cast cho đơn giản
import type { Product } from "@/types";

export default function Wishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 16;
  const { wishList } = useContextElement();

useEffect(() => {
  setItems((prev) => prev.filter((item) => wishList.includes(item.id)));
}, [wishList]);
  const handleRemoveFromWishlist = (productId: number) => {
  setItems((prev) => prev.filter((item) => item.id !== productId));
};

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await wishlistApi.getWishlist(page, PAGE_SIZE);

        // BE trả Page<ProductCardResponse>
        // nếu khác type Product thì bạn map/alias lại
        const data = res.data;
        setItems(data.content as Product[]);
        setTotalPages(data.totalPages ?? 0);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setItems([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [page]);

  return (
    <section className="s-account flat-spacing-4 pt_0">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {loading ? (
              <div>Loading wishlist...</div>
            ) : items.length ? (
              <div
                className="wrapper-shop tf-grid-layout tf-col-2 lg-col-3 xl-col-4 style-1"
                id="gridLayout"
              >
                {items.map((product, i) => (
                  <ProductCard key={product.id ?? i} product={product} onWishlistRemove={handleRemoveFromWishlist}/>
                ))}

                {/* Pagination từ BE */}
                {totalPages > 1 && (
                  <ul className="wg-pagination">
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <li
                        key={idx}
                        className={page === idx ? "active" : ""}
                      >
                        <button
                          type="button"
                          className="pagination-item"
                          onClick={() => setPage(idx)}
                        >
                          {idx + 1}
                        </button>
                      </li>
                    ))}

                    {page < totalPages - 1 && (
                      <li>
                        <button
                          type="button"
                          className="pagination-item"
                          onClick={() => setPage(page + 1)}
                        >
                          <i className="icon-arr-right2" />
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ) : (
              <div>
                <div>
                  Your wishlist is empty. Start adding favorite products to
                  wishlist!
                </div>
                <Link
                  className="tf-btn btn-dark2 animate-btn mt-3"
                  to="/shop-default"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
