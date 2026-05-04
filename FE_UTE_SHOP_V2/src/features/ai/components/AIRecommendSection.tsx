import { memo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { useTrending } from "../hooks/useRecommendations";
import { formatPrice } from "@/utils/formatPrice";
import type { ProductSuggestion } from "../types";

// ---- Skeleton card ----
const SkeletonCard = memo(() => (
  <div className="ai-rec-card ai-rec-card--skeleton">
    <div className="ai-rec-card__img skeleton-shimmer" />
    <div className="ai-rec-card__body">
      <div className="skeleton-shimmer" style={{ height: 12, width: "80%", borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: "50%", borderRadius: 4 }} />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

// ---- Single product card ----
const RecommendCard = memo(({ product }: { product: ProductSuggestion }) => (
  <Link
    to={`/product-detail/${product.id}`}
    className="ai-rec-card"
    aria-label={`Xem ${product.name}`}
  >
    <div className="ai-rec-card__img-wrap">
      <img
        src={product.imageUrl || "/images/placeholder.jpg"}
        alt={product.name}
        className="ai-rec-card__img lazyload"
        loading="lazy"
        width={200}
        height={260}
      />
      {product.originalPrice && product.originalPrice > product.price && (
        <span className="ai-rec-card__sale-badge" aria-label="Giảm giá">
          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </span>
      )}
    </div>
    <div className="ai-rec-card__body">
      <p className="ai-rec-card__name">{product.name}</p>
      <div className="ai-rec-card__price-wrap">
        <span className="ai-rec-card__price">{formatPrice(product.price)}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="ai-rec-card__old-price">{formatPrice(product.originalPrice)}</span>
        )}
      </div>
      {product.reason && (
        <p className="ai-rec-card__reason">{product.reason}</p>
      )}
    </div>
  </Link>
));
RecommendCard.displayName = "RecommendCard";

// ================================================================
// Main Section
// ================================================================
interface AIRecommendSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function AIRecommendSection({
  title = "Trending hôm nay",
  subtitle = "Sản phẩm đang được yêu thích nhiều nhất",
  limit = 8,
}: AIRecommendSectionProps) {
  const { data, isLoading, isError } = useTrending(limit);

  if (isError) return null;

  const products = data?.products ?? [];
  const showSkeletons = isLoading;

  return (
    <section className="ai-recommend-section flat-spacing-2" aria-label={title}>
      <div className="container">
        <div className="ai-recommend-section__header">
          <div>
            <div className="ai-recommend-section__badge" aria-hidden="true">
              <FiStar size={14} strokeWidth={2} />
              AI Powered
            </div>
            <h2 className="ai-recommend-section__title">{title}</h2>
            <p className="ai-recommend-section__subtitle">{subtitle}</p>
          </div>
          <Link to="/shop-default" className="ai-recommend-section__view-all btn-line">
            Xem tất cả
            <FiArrowRight size={16} className="ms-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="ai-rec-grid" role="list">
          {showSkeletons
            ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <RecommendCard key={product.id} product={product} />
              ))}
        </div>

        {!showSkeletons && products.length === 0 && (
          <div className="ai-rec-empty">
            <p>Chưa có dữ liệu trending. Hãy quay lại sau nhé!</p>
          </div>
        )}

        <div className="ai-recommend-section__footer">
          <Link to="/ai-stylist" className="ai-stylist-cta-link">
            <FiStar size={16} strokeWidth={2} aria-hidden="true" />
            Thử AI Stylist — Tạo outfit hoàn hảo cho bạn
            <FiArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
