"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import reviewApi, { type ReviewResponse } from "@/services/reviewApi";
import { useToast } from "@/components/common/Toast";

export default function MyReviews() {
  const { showToast, ToastContainer } = useToast();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Tránh gọi API nhiều lần trong React Strict Mode
    if (hasLoadedRef.current) return;
    
    const loadReviews = async () => {
      try {
        hasLoadedRef.current = true;
        setLoading(true);
        const res = await reviewApi.getMyReviews();
        setReviews(res.data.data);
      } catch (error: any) {
        hasLoadedRef.current = false; // Reset để có thể retry
        const errorMsg = error?.response?.data?.message || "Không thể tải danh sách đánh giá";
        showToast(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [showToast]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      pending: { label: "Chờ duyệt", class: "badge bg-warning" },
      approved: { label: "Đã duyệt", class: "badge bg-success" },
      rejected: { label: "Đã từ chối", class: "badge bg-danger" },
    };
    const statusInfo = statusMap[status] || { label: status, class: "badge bg-secondary" };
    return <span className={statusInfo.class}>{statusInfo.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="card p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải danh sách đánh giá...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Đánh giá của tôi</h4>
        <span className="badge bg-primary">{reviews.length} đánh giá</span>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-4 text-center">
          <i className="fas fa-comment-alt fa-3x text-muted mb-3" />
          <h5>Bạn chưa có đánh giá nào</h5>
          <p className="text-muted">
            Hãy mua sản phẩm và đánh giá để chia sẻ trải nghiệm của bạn!
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Link
                      to={`/product-details/${review.productId}`}
                      className="text-decoration-none fw-semibold"
                    >
                      Sản phẩm #{review.productId}
                    </Link>
                    {getStatusBadge(review.status)}
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fas fa-star ${
                            star <= review.rating ? "text-warning" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="fw-bold">{review.rating}/5</span>
                  </div>
                  {review.content && (
                    <p className="text-muted mb-2" style={{ whiteSpace: "pre-wrap" }}>
                      {review.content.length > 150
                        ? `${review.content.substring(0, 150)}...`
                        : review.content}
                    </p>
                  )}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="d-flex gap-2 mb-2">
                      {review.imageUrls.slice(0, 3).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Review ${index + 1}`}
                          className="rounded"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ))}
                      {review.imageUrls.length > 3 && (
                        <div
                          className="rounded bg-light d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px" }}
                        >
                          +{review.imageUrls.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-muted small mb-0">
                    <i className="fas fa-clock me-1" />
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div>
                  <Link
                    to={`/review/${review.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="fas fa-eye me-1" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

