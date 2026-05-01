import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import type { Outfit, OutfitItem } from "../../types";
import { saveOutfitEntry } from "../../lib/savedOutfitsStorage";

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
  const [saveHint, setSaveHint] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    const ok = saveOutfitEntry(outfit);
    setSaveHint(ok ? "Đã lưu vào thiết bị" : "Outfit này đã được lưu trước đó");
    window.setTimeout(() => setSaveHint(null), 2800);
  }, [outfit]);

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
          className="tf-btn btn-out-line-primary w-100 justify-content-center"
        >
          Xem trong shop
        </Link>
        <div className="ai-outfit-card__actions-row">
          <button
            type="button"
            className="tf-btn btn-primary animate-btn flex-grow-1 justify-content-center"
            onClick={handleAddAll}
          >
            <span className="icon icon-cart2" style={{ marginRight: 6 }} aria-hidden="true" />
            Thêm vào giỏ
          </button>
          <button
            type="button"
            className="tf-btn btn-out-line-dark flex-grow-1 justify-content-center"
            onClick={handleSave}
          >
            Lưu outfit
          </button>
        </div>
        {saveHint ? (
          <p className="ai-outfit-card__hint text-center mb-0" role="status">
            {saveHint}
          </p>
        ) : null}
      </div>
    </div>
  );
});
