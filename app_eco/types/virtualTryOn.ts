export type TryOnCategory = "upper_body" | "lower_body" | "dresses";

export type TryOnRequest = {
  productId: number;
  variantId: number | null;
  category: TryOnCategory;
  modelImageUrl: string;
  garmentImageUrl: string;
};

export type TryOnHistoryItem = {
  id: number;
  productId: number;
  variantId: number | null;
  category: string;
  modelImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
};

export type TryOnVariantOption = {
  variantId: number | null;
  imageUrl: string;
  label: string;
  category: TryOnCategory;
};
