// src/pages/ProductDetailPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Breadcumb from "@/components/productDetails/Breadcumb";
import DescriptionAccordion from "@/components/productDetails/DescriptionAccordion";
import Details from "@/components/productDetails/Details";
import RecentlyViewedProducts from "@/components/productDetails/RecentlyViewedProducts";
import RecommendedProdtcts from "@/components/productDetails/RecommendedProdtcts";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

import productApi from "@/services/productApi";
import type { Product, ProductTabsResponse } from "@/types/product";

const metadata = createPageMetadata("Chi tiết sản phẩm");

const RECENTLY_VIEWED_KEY = "recently_viewed_products";
const RECENTLY_VIEWED_MAX = 12; // tối đa 12 sản phẩm

function addToRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let list: Product[] = raw ? JSON.parse(raw) : [];

    // bỏ trùng id
    list = list.filter((p) => p.id !== product.id);

    // đưa sản phẩm hiện tại lên đầu
    list.unshift(product);

    // giới hạn số lượng
    if (list.length > RECENTLY_VIEWED_MAX) {
      list = list.slice(0, RECENTLY_VIEWED_MAX);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save recently viewed products", e);
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [tabsData, setTabsData] = useState<ProductTabsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const viewCountIncremented = useRef<Set<number>>(new Set()); // Track các product đã tăng view count

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const productId = Number(id);

    Promise.all([
      productApi.getProductDetail(productId),
      productApi.getProductTabs(productId),
    ])
      .then(([productRes, tabsRes]) => {
        setProduct(productRes.data);
        setTabsData(tabsRes.data);

        // ⭐ Lưu vào recently viewed
        addToRecentlyViewed(productRes.data);

        // ⭐ Tăng view count - chỉ gọi 1 lần cho mỗi product
        if (!viewCountIncremented.current.has(productId)) {
          viewCountIncremented.current.add(productId);
          productApi.incrementViewCount(productId).catch((err) => {
            console.error("Failed to increment view count:", err);
            // Nếu fail, remove khỏi set để có thể retry
            viewCountIncremented.current.delete(productId);
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load product or tabs", err);
        setProduct(null);
        setTabsData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center py-10">Đang tải sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm</p>;

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb product={product} />
      <Details product={product} />
      <DescriptionAccordion tabs={tabsData} />
      <RecentlyViewedProducts />
      <Footer paddingBottom />
    </>
  );
}
