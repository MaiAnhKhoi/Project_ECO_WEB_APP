// Re-export all types for convenience
export * from "./product";
export * from "./filter";
export * from "./context";
export * from "./wow";
export * from "./menu";
export * from "./swiper";
export * from "./common";
export * from "./blog";
export * from "./components";
export * from "./shop";
import type { Product } from "./product";
export type DetailsProps = {
  product: Product;
};