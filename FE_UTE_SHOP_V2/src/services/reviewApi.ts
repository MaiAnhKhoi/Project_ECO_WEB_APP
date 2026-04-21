import api from "@/config/api";
import { TestimonialItem } from "@/types/review";

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  content?: string;
}

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

export interface ReviewEligibility {
  canReview: boolean;
  completedPurchaseCount: number;
  reviewCount: number;
}

const reviewApi = {
  // Lấy danh sách review 5 sao dạng testimonial
  getTestimonials() {
    return api.get<TestimonialItem[]>("/reviews/public/testimonials");
  },

  // Tạo review (có upload ảnh)
  createReview(request: CreateReviewRequest, images?: File[]) {
    const formData = new FormData();
    // Gửi JSON string, backend sẽ parse
    formData.append("request", JSON.stringify(request));
    
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Không set Content-Type, axios sẽ tự động set với boundary cho multipart/form-data
    return api.post<{ success: boolean; data: ReviewResponse; message?: string }>(
      "/reviews",
      formData
    );
  },

  // Lấy danh sách review của sản phẩm
  getProductReviews(productId: number) {
    return api.get<{ success: boolean; data: ReviewResponse[] }>(
      `/reviews/product/${productId}`
    );
  },

  /** Đã mua COMPLETED và còn lượt đánh giá */
  checkUserReviewed(productId: number) {
    return api.get<{ success: boolean; data: ReviewEligibility }>(
      `/reviews/product/${productId}/check`
    );
  },

  // Xem chi tiết review
  getReviewDetail(reviewId: number) {
    return api.get<{ success: boolean; data: ReviewResponse }>(
      `/reviews/${reviewId}`
    );
  },

  // Lấy danh sách reviews của user hiện tại
  getMyReviews() {
    return api.get<{ success: boolean; data: ReviewResponse[] }>(
      "/reviews/my-reviews"
    );
  },
};

export default reviewApi;
