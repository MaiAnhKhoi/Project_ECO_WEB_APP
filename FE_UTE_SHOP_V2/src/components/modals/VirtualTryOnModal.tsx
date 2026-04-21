"use client";

import { useEffect, useState } from "react";
import virtualTryOnApi, {
  TryOnHistoryItem,
} from "@/services/virtualTryOnApi";
import uploadApi from "@/services/uploadApi";
import type { Product } from "@/types/product";

export interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  /** Cho phép thử đồ? (đã kiểm tra ở trang chi tiết) */
  isSupported?: boolean;
  /** Sản phẩm dạng "bộ"/set: cho phép chọn thử Áo hoặc Quần */
  isSetProduct?: boolean;
}

type VariantForTryOn = {
  variantId: number | null;
  imageUrl: string;
  label: string;
  category: "upper_body" | "lower_body" | "dresses";
};

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  product,
  isSupported = true,
  isSetProduct = false,
}: VirtualTryOnModalProps) {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<VariantForTryOn | null>(null);
  const [variants, setVariants] = useState<VariantForTryOn[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<VariantForTryOn["category"]>("upper_body");
  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);
  const [loadingTryOn, setLoadingTryOn] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [validatingImage, setValidatingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Detect category + build variants (giống cũ, nhưng cho phép chọn lại nếu là bộ)
  useEffect(() => {
    if (!isSupported) {
      setVariants([]);
      setSelectedVariant(null);
      return;
    }

    console.log("🔥 [VTON] useEffect RUN, product =", product);

    if (!product) return;

    const name = (
      (product as any).title ||
      (product as any).name ||
      ""
    ).toLowerCase();

    console.log("📌 [VTON] detect from name =", name);

    let category: VariantForTryOn["category"] = "upper_body";

    if (
      name.includes("váy") ||
      name.includes("vay") ||
      name.includes("đầm") ||
      name.includes("dam") ||
      name.includes("dress")
    ) {
      category = "dresses";
      console.log("✅ Detect: DRESSES (váy/đầm)");
    } else if (
      name.includes("quần") ||
      name.includes("quan") ||
      name.includes("jean") ||
      name.includes("kaki") ||
      name.includes("short")
    ) {
      category = "lower_body";
      console.log("✅ Detect: LOWER_BODY (quần)");
    } else if (
      name.includes("áo") ||
      name.includes("ao") ||
      name.includes("shirt") ||
      name.includes("tee") ||
      name.includes("hoodie")
    ) {
      category = "upper_body";
      console.log("✅ Detect: UPPER_BODY (áo)");
    } else {
      console.log("⚠ Không detect được, DEFAULT = upper_body", name);
    }

    if (isSetProduct) {
      category = selectedCategory;
    } else {
      setSelectedCategory(category);
    }

    const colors = (product as any).colors || [];
    const vs: VariantForTryOn[] = colors.flatMap((c: any) =>
      (c.sizes || []).map((s: any) => ({
        variantId: s.variantId || null,
        imageUrl: c.img || c.imageSrc || (product as any).imgSrc,
        label: `${c.label || "Màu"} - ${s.size || "Size"}`,
        category,
      }))
    );

    console.log("🎯 built variants =", vs);

    if (vs.length > 0) {
      setVariants(vs);
      setSelectedVariant(vs[0]);
    }
  }, [product, isSupported, isSetProduct, selectedCategory]);

  // Lấy lịch sử khi mở modal
  useEffect(() => {
    if (!isOpen || !product?.id) return;

    setLoadingHistory(true);
    virtualTryOnApi
      .getHistory(product.id)
      .then((res) => {
        setHistory(res);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => {
        setLoadingHistory(false);
      });
  }, [isOpen, product?.id]);

  // Reset khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setModelFile(null);
      if (modelPreview) {
        URL.revokeObjectURL(modelPreview);
      }
      setModelPreview(null);
      setError(null);
      setSuccess(null);
      setLoadingTryOn(false);
      setValidatingImage(false);
    }
  }, [isOpen, modelPreview]);

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (modelPreview) {
        URL.revokeObjectURL(modelPreview);
      }
    };
  }, [modelPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP).");
      if (e.target) {
        e.target.value = "";
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB.");
      if (e.target) {
        e.target.value = "";
      }
      return;
    }

    // ⭐ Validate ảnh với product category (giới tính)
    setValidatingImage(true);
    
    try {
      const res = await uploadApi.validateModelImage(file, product.id);
      
      // Kiểm tra nếu response có success = false (backend reject)
      if (res.data?.success === false || res.data?.data?.valid === false) {
        const errorMessage = res.data?.message || "Ảnh không phù hợp! Vui lòng chọn ảnh phù hợp với giới tính của sản phẩm.";
        setError(errorMessage);
        
        // Reset file input và preview
        setModelFile(null);
        if (modelPreview) {
          URL.revokeObjectURL(modelPreview);
          setModelPreview(null);
        }
        if (e.target) {
          e.target.value = "";
        }
        return;
      }

      // Nếu hợp lệ, set file và preview
      setModelFile(file);
      // Revoke old preview URL if exists
      if (modelPreview) {
        URL.revokeObjectURL(modelPreview);
      }
      setModelPreview(URL.createObjectURL(file));
      setError(null);
      setSuccess("✅ Ảnh hợp lệ! Bạn có thể tiếp tục thử đồ.");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      // Handle timeout error
      if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        setError("Thời gian kiểm tra ảnh quá lâu. Vui lòng thử lại sau hoặc chọn ảnh khác.");
      } 
      // Handle 400 Bad Request (validation failed)
      else if (err?.response?.status === 400) {
        const errorMsg = err?.response?.data?.message || "Ảnh không phù hợp! Vui lòng chọn ảnh phù hợp với giới tính của sản phẩm.";
        setError(errorMsg);
      }
      // Handle other errors
      else {
        const errorMsg = err?.response?.data?.message || err?.message || "Lỗi khi kiểm tra ảnh. Vui lòng thử lại.";
        setError(errorMsg);
      }
      
      // Reset file input và preview
      setModelFile(null);
      if (modelPreview) {
        URL.revokeObjectURL(modelPreview);
        setModelPreview(null);
      }
      if (e.target) {
        e.target.value = "";
      }
    } finally {
      setValidatingImage(false);
    }
  };

  const ensureLoggedIn = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert(
        "Bạn cần đăng nhập để sử dụng tính năng thử đồ ảo.\nVui lòng đăng nhập và thử lại."
      );
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const handleTryOn = async () => {
    if (!ensureLoggedIn()) return;

    if (!modelFile) {
      setError("Vui lòng chọn ảnh của bạn trước.");
      return;
    }

    if (!selectedVariant) {
      setError("Vui lòng chọn một biến thể sản phẩm.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoadingTryOn(true);

    try {
      const uploadRes = await uploadApi.uploadModelImage(modelFile);
      const modelUrl = uploadRes.data.data.url;

      const res = await virtualTryOnApi.tryOn({
        productId: product.id,
        variantId: selectedVariant.variantId,
        category: selectedVariant.category,
        modelImageUrl: modelUrl,
        garmentImageUrl: selectedVariant.imageUrl,
      });

      setHistory((prev) => [res, ...prev].slice(0, 10));
      setSuccess("Thử đồ thành công! Kết quả đã được lưu.");

      setTimeout(() => {
        const resultElement = document.getElementById("tryon-result");
        if (resultElement) {
          resultElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    } catch (e: any) {
      const errorMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Có lỗi xảy ra khi thử đồ. Vui lòng thử lại sau.";
      setError(errorMsg);
    } finally {
      setLoadingTryOn(false);
    }
  };

  const handleViewHistoryItem = (item: TryOnHistoryItem) => {
    setHistory((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [selectedItem] = copy.splice(idx, 1);
      copy.unshift(selectedItem);
      return copy;
    });
  };

  if (!isOpen) return null;

  if (!isSupported) {
    return (
      <div className={`modal fade modal-payos ${isOpen ? "show d-block" : ""}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thử đồ ảo</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Tính năng thử đồ ảo chỉ hỗ trợ trang phục (áo, quần, váy/đầm). Sản phẩm này thuộc phụ kiện nên không thể thử.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`modal fade modal-payos ${isOpen ? "show d-block" : ""}`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            {/* HEADER – giống style PayOS */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-magic me-2" />
                Thử đồ ảo với AI
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={validatingImage || loadingTryOn}
                aria-label="Close"
              />
            </div>

            {/* BODY – layout 2 cột, dùng style Bootstrap cơ bản */}
            <div className="modal-body">
              {/* Nếu là sản phẩm "bộ", cho chọn phần muốn thử */}
              {isSetProduct && (
                <div className="alert alert-info py-2 mb-3">
                  <div className="fw-bold mb-2">Chọn phần muốn thử</div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedCategory === "upper_body"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setSelectedCategory("upper_body")}
                    >
                      Áo / Top
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedCategory === "lower_body"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setSelectedCategory("lower_body")}
                    >
                      Quần / Bottom
                    </button>
                  </div>
                </div>
              )}
              <div className="row g-4">
                {/* Cột trái: Upload ảnh người dùng */}
                <div className="col-lg-6">
                  <h6 className="fw-bold mb-2">
                    Bước 1: Tải ảnh của bạn
                  </h6>
                  <p className="text-muted small mb-3">
                    Ảnh toàn thân, đứng thẳng, rõ người.
                  </p>

                  <div
                    className="border rounded-3 p-3 text-center position-relative"
                    style={{
                      minHeight: 260,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: validatingImage ? 0.6 : 1,
                      pointerEvents: validatingImage ? "none" : "auto",
                    }}
                  >
                    {validatingImage ? (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div
                          className="spinner-border text-primary mb-2"
                          role="status"
                          style={{ width: "3rem", height: "3rem" }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-primary fw-semibold mb-0">
                          Đang kiểm tra ảnh...
                        </p>
                        <p className="text-muted small mt-2">
                          Vui lòng đợi trong giây lát
                        </p>
                      </div>
                    ) : modelPreview ? (
                      <>
                        <img
                          src={modelPreview}
                          alt="Your preview"
                          className="img-fluid rounded mb-3"
                          style={{
                            maxHeight: 220,
                            objectFit: "contain",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setModelFile(null);
                            if (modelPreview) {
                              URL.revokeObjectURL(modelPreview);
                            }
                            setModelPreview(null);
                            setError(null);
                            setSuccess(null);
                            // Reset file input
                            const fileInput = document.getElementById("model-image-input") as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = "";
                            }
                          }}
                          disabled={validatingImage || loadingTryOn}
                        >
                          <i className="fas fa-redo me-1" />
                          Chọn ảnh khác
                        </button>
                      </>
                    ) : (
                      <label
                        htmlFor="model-image-input"
                        className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                        style={{ cursor: validatingImage ? "not-allowed" : "pointer" }}
                      >
                        <i className="fas fa-cloud-upload-alt fa-2x mb-2 text-muted" />
                        <p className="mb-1">
                          Kéo thả ảnh vào đây hoặc click để chọn file
                        </p>
                        <p className="text-muted small mb-0">
                          Hỗ trợ JPG, PNG, GIF, WEBP (tối đa 5MB)
                        </p>
                      </label>
                    )}

                    <input
                      id="model-image-input"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                      disabled={validatingImage || loadingTryOn}
                    />
                  </div>
                </div>

                {/* Cột phải: Chọn biến thể + Kết quả */}
                <div className="col-lg-6">
                  <h6 className="fw-bold mb-2">
                    Bước 2: Chọn biến thể sản phẩm
                  </h6>
                  <p className="text-muted small mb-3">
                    Chọn màu và size bạn muốn thử.
                  </p>

                  {/* Danh sách biến thể */}
                  <div className="mb-3">
                    {variants.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {variants.map((v, idx) => {
                          const isActive = selectedVariant === v;
                          return (
                            <button
                              key={`${v.variantId}-${idx}`}
                              type="button"
                              onClick={() => setSelectedVariant(v)}
                              disabled={validatingImage || loadingTryOn}
                              className={`btn btn-sm ${
                                isActive
                                  ? "btn-dark2"
                                  : "btn-outline-secondary"
                              } d-flex align-items-center`}
                            >
                              <img
                                src={v.imageUrl}
                                alt={v.label}
                                className="rounded me-2"
                                style={{
                                  width: 32,
                                  height: 32,
                                  objectFit: "cover",
                                }}
                              />
                              <span className="small">{v.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="alert alert-info mb-0">
                        <i className="fas fa-info-circle me-2" />
                        Sản phẩm chưa có biến thể cụ thể.
                      </div>
                    )}
                  </div>

                  {/* Kết quả / Loading / Lịch sử */}
                  <div id="tryon-result">
                    {loadingTryOn ? (
                      <div className="border rounded-3 p-3 text-center">
                        <div
                          className="spinner-border text-secondary mb-2"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Loading...
                          </span>
                        </div>
                        <p className="mb-0 small">
                          AI đang xử lý ảnh, vui lòng đợi...
                        </p>
                      </div>
                    ) : history.length > 0 ? (
                      <div className="border rounded-3 p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">
                            <i className="fas fa-image me-2 text-secondary" />
                            Kết quả mới nhất
                          </span>
                          {history.length > 1 && (
                            <span className="badge bg-secondary">
                              {history.length} ảnh đã thử
                            </span>
                          )}
                        </div>
                        <img
                          src={history[0].resultImageUrl}
                          alt="Try-on result"
                          className="img-fluid rounded"
                          style={{
                            maxHeight: 280,
                            width: "100%",
                            objectFit: "contain",
                            background: "#f8f9fa",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="border rounded-3 p-3 text-center">
                        <i className="fas fa-image fa-2x text-muted mb-2" />
                        <p className="text-muted mb-0 small">
                          Chưa có kết quả thử đồ nào.
                          <br />
                          Hãy upload ảnh và chọn biến thể để thử ngay!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lịch sử mini */}
                  {history.length > 1 && (
                    <div className="mt-2">
                      <p className="text-muted small mb-1 fw-semibold">
                        <i className="fas fa-history me-1" />
                        Ảnh đã thử gần đây
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {history.slice(1, 7).map((h) => (
                          <div
                            key={h.id}
                            className="position-relative"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewHistoryItem(h)}
                            title="Click để xem"
                          >
                            <img
                              src={h.resultImageUrl}
                              alt="History"
                              className="rounded"
                              style={{
                                width: 60,
                                height: 80,
                                objectFit: "cover",
                              }}
                            />
                            <div
                              className="position-absolute top-0 end-0 rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                              style={{
                                width: 18,
                                height: 18,
                                fontSize: 9,
                              }}
                            >
                              <i className="fas fa-eye text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {loadingHistory && (
                    <p className="text-muted small mt-2">
                      Đang tải lịch sử thử đồ...
                    </p>
                  )}
                </div>
              </div>

              {/* Messages giống style thông báo ở modal thanh toán */}
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show mt-3"
                  role="alert"
                >
                  <i className="fas fa-exclamation-triangle me-2" />
                  <strong>Lỗi:</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                    disabled={validatingImage}
                  />
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success alert-dismissible fade show mt-3"
                  role="alert"
                >
                  <i className="fas fa-check-circle me-2" />
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                    aria-label="Close"
                  />
                </div>
              )}
            </div>

            {/* FOOTER – đồng bộ với PayOS (btn-dark2 + btn-secondary) */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loadingTryOn || validatingImage}
              >
                Đóng
              </button>
              <button
                className="btn btn-dark2"
                disabled={loadingTryOn || validatingImage || !modelFile || !selectedVariant}
                onClick={handleTryOn}
              >
                {loadingTryOn ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic me-2" />
                    Thử ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
