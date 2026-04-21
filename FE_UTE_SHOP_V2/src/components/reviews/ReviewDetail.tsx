"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import reviewApi, { type ReviewResponse } from "@/services/reviewApi";
import { useToast } from "@/components/common/Toast";
import { useAuth } from "@/context/authContext";

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { user } = useAuth();
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) {
      showToast("Không tìm thấy ID đánh giá", "error");
      navigate("/");
      return;
    }

    // Tránh gọi API nhiều lần cho cùng một ID
    if (hasLoadedRef.current === id) return;

    const loadReview = async () => {
      try {
        hasLoadedRef.current = id;
        setLoading(true);
        const res = await reviewApi.getReviewDetail(Number(id));
        setReview(res.data.data);
      } catch (error: any) {
        hasLoadedRef.current = null; // Reset để có thể retry
        const errorMsg = error?.response?.data?.message || "Không thể tải đánh giá";
        showToast(errorMsg, "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [id, navigate, showToast]);

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
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="card p-4 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải đánh giá...</p>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="card p-4">
            <h4>Không tìm thấy đánh giá</h4>
            <Link to="/" className="btn btn-primary mt-3">
              Về trang chủ
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  const isOwner = user && user.id === review.userId;

  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        <div className="mb-3">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2" />
            Quay lại
          </button>
        </div>

        <div className="card p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="mb-2">Chi tiết đánh giá</h3>
              <div className="d-flex align-items-center gap-2">
                {getStatusBadge(review.status)}
                {isOwner && (
                  <span className="badge bg-info">Đánh giá của bạn</span>
                )}
              </div>
            </div>
            <div className="text-end">
              <p className="text-muted mb-1">
                <small>Ngày tạo: {formatDate(review.createdAt)}</small>
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-8">
              <div className="mb-4">
                <h5 className="mb-3">Thông tin sản phẩm</h5>
                <Link
                  to={`/product-details/${review.productId}`}
                  className="text-decoration-none"
                >
                  <p className="mb-0">
                    <i className="fas fa-box me-2" />
                    Xem sản phẩm #{review.productId}
                  </p>
                </Link>
              </div>

              <div className="mb-4">
                <h5 className="mb-3">Đánh giá</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fw-semibold">Điểm đánh giá:</span>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fas fa-star ${
                            star <= review.rating ? "text-warning" : "text-muted"
                          }`}
                        />
                      ))}
                      <span className="ms-2 fw-bold">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                {review.content && (
                  <div>
                    <p className="fw-semibold mb-2">Nội dung đánh giá:</p>
                    <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                      {review.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h5 className="mb-3">Người đánh giá</h5>
                <div className="d-flex align-items-center gap-3">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="rounded-circle"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                      style={{ width: "50px", height: "50px" }}
                    >
                      {review.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="mb-0 fw-semibold">{review.userName}</p>
                    <p className="mb-0 text-muted small">ID: #{review.userId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="mb-3">Ảnh minh họa</h5>
                  {review.imageUrls && review.imageUrls.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {review.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Review image ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">
                      <i className="fas fa-image me-2" />
                      Không có hình ảnh
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

