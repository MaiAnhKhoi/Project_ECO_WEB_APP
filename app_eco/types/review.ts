/** GET /reviews/product/:id/check */
export interface ReviewEligibility {
  canReview: boolean;
  completedPurchaseCount: number;
  reviewCount: number;
}

/** Khớp `ReviewResponse` từ backend / web. */
export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  rating: number;
  content: string | null;
  status: string;
  createdAt: string;
  imageUrls: string[];
}

export interface CreateReviewPayload {
  productId: number;
  rating: number;
  content?: string;
}

export interface Testimonial {
  name: string;
  review: string;
  product?: string | null;
  image?: string | null;
  delay?: string | null;
}
