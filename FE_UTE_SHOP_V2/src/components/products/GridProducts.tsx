import ProductCard from "../productCards/ProductCard";
import type { Product, GridProductsProps } from "@/types";

export default function GridProducts({
  products,
  cardStyleClass,
  tooltipDirection = "left",
}: GridProductsProps) {
  return (
    <>
      {products.map((product: Product, i: number) => (
        <ProductCard
          key={i}
          product={product}
          styleClass={cardStyleClass ? cardStyleClass : "grid style-1"}
          tooltipDirection={tooltipDirection}
        />
      ))}
    </>
  );
}
