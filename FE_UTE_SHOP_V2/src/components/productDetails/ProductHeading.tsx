import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";

interface ProductHeadingProps {
  product: Product;
  showProgress?: boolean;
}

export default function ProductHeading({
  product,
  showProgress = true,
}: ProductHeadingProps) {
  if (!product) return null;

  const inStock = product.inStock ?? false;
  const price = product.price;
  const oldPrice = product.oldPrice;
  const saleLabel = product.saleLabel;
  const brand = product.filterBrands?.[0] ?? ""; // hoặc product.brand nếu có
  const sold = product.sold ?? 0;
  const stockProgress = product.stockProgress ?? 0;
  const stockProgressPercent = product.stockProgressPercent ?? 0;

  return (
    <div className={`tf-product-heading ${inStock ? "" : "pb-0 border-0"}`}>
      {brand && <span className="brand-product">{brand}</span>}
      <h5 className="product-name fw-medium">{product.title}</h5>

      <div className="product-price">
        {price && <div className="display-sm price-new price-on-sale">{formatPrice(price)}</div>}
        {oldPrice && <div className="display-sm price-old">{formatPrice(oldPrice)}</div>}
        {saleLabel && <span className="badge-sale">{saleLabel}</span>}
      </div>

      {inStock ? (
        <div className="product-stock">
          <span className="stock in-stock">Còn hàng</span>
          {sold > 0 && <span className="text-dark">{sold} sản phẩm đã bán trong 24 giờ qua</span>}
        </div>
      ) : (
        <div className="product-stock">
          <span className="stock out-stock">Hết hàng</span>
        </div>
      )}

      {showProgress && stockProgress > 0 && (
        <div className="product-progress-sale">
          <div className="title-hurry-up">
            <span className="text-primary fw-medium">NHANH LÊN!</span> Chỉ còn{" "}
            <span className="count">{stockProgress}</span> sản phẩm!
          </div>
          <div className="progress-sold">
            <div
              className="value"
              style={{ width: `${stockProgressPercent}%` }}
              data-progress={stockProgressPercent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
