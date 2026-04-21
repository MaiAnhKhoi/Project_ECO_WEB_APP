// src/components/productDetails/Reviews.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import reviewApi, { type ReviewResponse } from "@/services/reviewApi";
import { useToast } from "@/components/common/Toast";
import type { ProductTabsResponse } from "@/types/product";

type ReviewsProps = {
  data: ProductTabsResponse["reviews"] | null;
};

export default function Reviews({ data }: ReviewsProps) {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const productId = id ? Number(id) : null;

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [eligibility, setEligibility] = useState<{
    canReview: boolean;
    completedPurchaseCount: number;
    reviewCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = Boolean(user);
  const hasLoadedRef = useRef<number | null>(null);

  // Load reviews từ API
  useEffect(() => {
    if (!productId) return;
    
    // Tránh gọi API nhiều lần cho cùng một productId
    if (hasLoadedRef.current === productId) return;
    
    const loadReviews = async () => {
      try {
        hasLoadedRef.current = productId;
        const res = await reviewApi.getProductReviews(productId);
        setReviews(res.data.data);
      } catch (error) {
        hasLoadedRef.current = null; // Reset để có thể retry
        console.error("Failed to load reviews:", error);
      }
    };

    loadReviews();

    if (isLoggedIn) {
      reviewApi
        .checkUserReviewed(productId)
        .then((res) => setEligibility(res.data.data))
        .catch(() => setEligibility(null));
    } else {
      setEligibility(null);
    }
  }, [productId, isLoggedIn]);

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      showToast("Tối đa 5 ảnh", "warning");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Ảnh ${file.name} vượt quá 5MB`, "error");
        return false;
      }
      return true;
    });

    setImages(validFiles);
    
    // Tạo preview
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Xóa ảnh
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      showToast("Không tìm thấy sản phẩm", "error");
      return;
    }

    if (!isLoggedIn) {
      showToast("Vui lòng đăng nhập để đánh giá", "warning");
      return;
    }

    if (rating === 0) {
      showToast("Vui lòng chọn đánh giá", "warning");
      return;
    }

    setLoading(true);
    try {
      await reviewApi.createReview(
        {
          productId,
          rating: rating as number,
          content: content || undefined,
        },
        images.length > 0 ? images : undefined
      );

      showToast("Đánh giá đã được gửi thành công!", "success");
      
      // Reset form
      setRating(0);
      setContent("");
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const eligRes = await reviewApi.checkUserReviewed(productId);
      setEligibility(eligRes.data.data);

      // Reload reviews
      const res = await reviewApi.getProductReviews(productId);
      setReviews(res.data.data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể gửi đánh giá";
      showToast(message, "error");
      console.error("Failed to submit review:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán summary từ reviews
  const summary = data ? data.summary : {
    averageRating: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
    totalReviews: reviews.length,
    breakdown: Array.from({ length: 5 }, (_, i) => ({
      rating: 5 - i,
      count: reviews.filter((r) => r.rating === 5 - i).length,
    })),
  };

  return (
    <>
      <ToastContainer />
      <div className="review-heading">
        <h6 className="title">Customer review</h6>
        <div className="box-rate-review">
          <div className="rating-summary">
            <ul className="list-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <i className="icon icon-star" />
                </li>
              ))}
              <li>
                <span className="count-star text-md">
                  ({summary.totalReviews})
                </span>
              </li>
            </ul>
            <span className="text-md rating-average">
              {summary.averageRating.toFixed(1)}/5.0
            </span>
          </div>

          <div className="rating-breakdown">
            {summary.breakdown.map((item) => {
              const percent =
                summary.totalReviews === 0
                  ? 0
                  : (item.count / summary.totalReviews) * 100;

              return (
                <div className="rating-breakdown-item" key={item.rating}>
                  <div className="rating-score">
                    {item.rating} <i className="icon icon-star" />
                  </div>
                  <div className="rating-bar">
                    <div
                      className="value"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="rating-count">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
        {isLoggedIn && eligibility?.canReview && (
          <a href="#form-review" className="tf-btn btn-dark2 animate-btn">
            Write a review
          </a>
        )}
        {isLoggedIn && eligibility && !eligibility.canReview && (
          <p className="text-sm text-muted">
            {eligibility.completedPurchaseCount === 0
              ? "Bạn cần mua và nhận hàng (đơn hoàn thành) trước khi được đánh giá sản phẩm này."
              : "Bạn đã gửi đủ số lần đánh giá theo số lần mua đã hoàn thành."}
          </p>
        )}
      </div>

      <div className="review-section">
        <ul className="review-list">
          {reviews.length === 0 ? (
            <li className="text-center py-4">
              <p className="text-muted">Chưa có đánh giá nào</p>
            </li>
          ) : (
            reviews.map((review) => (
              <li className="review-item" key={review.id}>
                <div className="review-avt">
                  {review.userAvatar ? (
                    <img
                      alt="avatar"
                      src={review.userAvatar}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="review-avt-placeholder">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="review-content">
                  <div className="review-info">
                    <div className="review-meta">
                      <span className="review-author fw-medium text-md">
                        {review.userName}
                      </span>
                      <span className="review-date text-sm">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="list-star">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <i className="icon icon-star" key={i} />
                      ))}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {review.status && (
                      <span className={`badge ${
                        review.status === "approved" ? "bg-success" :
                        review.status === "pending" ? "bg-warning" :
                        review.status === "rejected" ? "bg-danger" :
                        "bg-secondary"
                      }`}>
                        {review.status === "approved" ? "Đã duyệt" :
                         review.status === "pending" ? "Chờ duyệt" :
                         review.status === "rejected" ? "Đã từ chối" :
                         review.status}
                      </span>
                    )}
                    <Link
                      to={`/review/${review.id}`}
                      className="text-decoration-none text-primary small"
                    >
                      <i className="fas fa-eye me-1" />
                      Xem chi tiết
                    </Link>
                  </div>
                  {review.content && (
                    <p className="text text-sm text-main-4">{review.content}</p>
                  )}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="review-images mt-3">
                      {review.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Review image ${idx + 1}`}
                          className="review-image"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            marginRight: "10px",
                            marginBottom: "10px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Form review - chỉ hiển thị nếu đã đăng nhập và chưa review */}
        {isLoggedIn && eligibility?.canReview && (
          <form
            id="form-review"
            onSubmit={handleSubmit}
            className="form-review"
          >
            <h6 className="title">Write a review</h6>
            <p className="note text-md text-main-4">
              {user?.name && user?.email && (
                <>
                  Đánh giá với tư cách: <strong>{user.name}</strong> ({user.email})
                </>
              )}
              <br />
              Required fields are marked *
            </p>
            <div className="box-rating">
              <span className="text-md">Your rating *</span>
              <div className="list-rating-check">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star}>
                    <input
                      type="radio"
                      id={`star${star}`}
                      name="rate"
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                      required
                    />
                    <label htmlFor={`star${star}`} title={`${star} stars`} />
                  </div>
                ))}
              </div>
            </div>
            <textarea
              name="note"
              id="note"
              placeholder="Your review *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
            
            {/* Upload ảnh */}
            <div className="mb-3">
              <label className="text-md mb-2 d-block">Ảnh đánh giá (tối đa 5 ảnh, mỗi ảnh &lt; 5MB)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-control"
              />
              {imagePreviews.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="position-relative" style={{ width: "100px", height: "100px" }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        style={{ transform: "translate(50%, -50%)" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="tf-btn animate-btn"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Submit"}
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <div className="text-center py-4">
            <p className="text-muted mb-3">Vui lòng đăng nhập để đánh giá sản phẩm</p>
            <button
              className="tf-btn animate-btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#login"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </>
  );
}
