import ProductCard from "../productCards/ProductCard";
import type { Product, ListProductsProps } from "@/types";

export default function ListProducts({ products }: ListProductsProps) {
  return (
    <>
      {products.map((product: Product, i: number) => (
        <ProductCard key={i} product={product} />
      ))}
    </>
  );
}
