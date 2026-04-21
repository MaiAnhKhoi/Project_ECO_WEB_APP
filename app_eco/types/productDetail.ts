/** Payload `/products/:id/details` — đồng bộ với web FE. */
export type ProductTabsResponse = {
  productId: number;
  description: {
    productId: number;
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
  materials: {
    productId: number;
    title: string;
    items: string[];
  };
  additionalInfo: { label: string; value: string }[];
  reviews: {
    productId: number;
    summary: {
      averageRating: number;
      totalReviews: number;
      breakdown: { rating: number; count: number }[];
    };
    reviews: {
      id: number;
      name: string;
      date: string;
      avatar?: string;
      rating: number;
      comment: string;
    }[];
  };
};
