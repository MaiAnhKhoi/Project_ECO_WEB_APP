import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import type { Outfit, OutfitItem } from "../../types";

const OutfitItemRow = memo(({ item }: { item: OutfitItem }) => (
  <Link to={`/product-detail/${item.productId}`} className="ai-outfit-item">
    <div className="ai-outfit-item__img-wrap">
      <img
        src={item.imageUrl || "/images/placeholder.jpg"}
        alt={item.productName}
        className="ai-outfit-item__img"
        loading="lazy"
        width={80}
        height={100}
      />
    </div>
    <div className="ai-outfit-item__info">
      <span className="ai-outfit-item__role">{item.role}</span>
      <p className="ai-outfit-item__name">{item.productName}</p>
      <p className="ai-outfit-item__price">{formatPrice(item.price)}</p>
    </div>
  </Link>
));
OutfitItemRow.displayName = "OutfitItemRow";

export interface OutfitResultCardProps {
  outfit: Outfit;
  onAddItemsToCart: (productIds: number[]) => void;
}

export const OutfitResultCard = memo(function OutfitResultCard({
  outfit,
  onAddItemsToCart,
}: OutfitResultCardProps) {
  const handleAddAll = useCallback(() => {
    onAddItemsToCart(outfit.items.map((i) => i.productId));
  }, [outfit.items, onAddItemsToCart]);

  const shopFilterUrl = `/shop-default?ids=${outfit.items.map((i) => i.productId).join(",")}`;

  return (
    <div className="ai-outfit-card">
      <div className="ai-outfit-card__header">
        <span className="ai-outfit-card__number">Outfit {outfit.outfitNumber}</span>
        <h3 className="ai-outfit-card__name">{outfit.name}</h3>
        {outfit.occasion ? (
          <span className="ai-outfit-card__badge">{outfit.occasion}</span>
        ) : null}
      </div>

      {outfit.description ? (
        <p className="ai-outfit-card__desc">{outfit.description}</p>
      ) : null}

      <div className="ai-outfit-card__items">
        {outfit.items.map((item) => (
          <OutfitItemRow key={item.productId} item={item} />
        ))}
      </div>

      <div className="ai-outfit-card__footer">
        <div className="ai-outfit-card__total">
          <span className="text-sm text-main">Tổng</span>
          <span className="ai-outfit-card__total-price">
            {formatPrice(outfit.totalPrice)}
          </span>
        </div>
      </div>

      <div className="ai-outfit-card__actions">
        <Link
          to={shopFilterUrl}
          className="ai-outfit-card__link-shop"
        >
          Xem trong shop
        </Link>
        <button
          type="button"
          className="tf-btn btn-primary btn-small ai-outfit-card__btn-cart"
          onClick={handleAddAll}
        >
          <span className="icon icon-cart2" style={{ marginRight: 6 }} aria-hidden="true" />
          Thêm giỏ hàng
        </button>
      </div>
    </div>
  );
});
