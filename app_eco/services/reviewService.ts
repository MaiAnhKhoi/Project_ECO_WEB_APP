import { httpClient } from "@/lib/httpClient";
import type {
  CreateReviewPayload,
  ReviewApiResponse,
  ReviewEligibility,
  ReviewResponse,
  Testimonial,
} from "@/types/review";

/** GET /reviews/public/testimonials */
export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await httpClient.get<ReviewApiResponse<Testimonial[]>>("/reviews/public/testimonials");
  return Array.isArray(res?.data) ? res.data : [];
}

/** GET /reviews/product/{productId} */
export async function getProductReviews(productId: number): Promise<ReviewResponse[]> {
  const res = await httpClient.get<ReviewApiResponse<ReviewResponse[]>>(
    `/reviews/product/${productId}`
  );
  return Array.isArray(res?.data) ? res.data : [];
}

/** GET /reviews/product/{productId}/check — cần đăng nhập */
export async function getReviewEligibility(
  productId: number,
  token: string
): Promise<ReviewEligibility> {
  const res = await httpClient.get<ReviewApiResponse<ReviewEligibility>>(
    `/reviews/product/${productId}/check`,
    { token }
  );
  if (!res?.data || typeof res.data.canReview !== "boolean") {
    throw new Error(res?.message || "Không kiểm tra được quyền đánh giá");
  }
  return res.data;
}

/** POST /reviews — multipart giống web */
export async function createReview(
  token: string,
  payload: CreateReviewPayload,
  imageUris: { uri: string; name: string; type: string }[]
): Promise<ReviewResponse> {
  const form = new FormData();
  form.append("request", JSON.stringify(payload));
  for (const img of imageUris) {
    form.append("images", { uri: img.uri, name: img.name, type: img.type } as any);
  }
  const res = await httpClient.postMultipart<ReviewApiResponse<ReviewResponse>>(
    "/reviews",
    form,
    token
  );
  if (res?.data == null) {
    throw new Error(res?.message || "Không nhận được dữ liệu đánh giá");
  }
  return res.data;
}

/** GET /reviews/my-reviews */
export async function getMyReviews(token: string): Promise<ReviewResponse[]> {
  const res = await httpClient.get<ReviewApiResponse<ReviewResponse[]>>("/reviews/my-reviews", {
    token,
  });
  return Array.isArray(res?.data) ? res.data : [];
}

/** GET /reviews/{id} — token giúp xem bản chờ duyệt của chính mình */
export async function getReviewDetail(
  reviewId: number,
  token?: string | null
): Promise<ReviewResponse> {
  const res = await httpClient.get<ReviewApiResponse<ReviewResponse>>(`/reviews/${reviewId}`, {
    token: token ?? undefined,
  });
  if (res?.data == null) {
    throw new Error(res?.message || "Không tải được đánh giá");
  }
  return res.data;
}
