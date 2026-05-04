import {
  useCallback,
  useRef,
  useState,
  memo,
  useMemo,
  type DragEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiCamera,
  FiClock,
  FiDroplet,
  FiImage,
  FiShoppingBag,
  FiShoppingCart,
  FiUploadCloud,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";
import { useContextElement } from "@/context/Context";
import { useAuth } from "@/context/authContext";
import { useStyleAnalysis } from "../hooks/useStyleAnalysis";
import { fetchStyleHistoryDetail } from "../api/aiApi";
import { aiStyleHistoryDetailKey } from "../queryKeys";
import type { StyleAnalysisResponse, ProductSuggestion, StyleAnalysisHistoryItem } from "../types";
import { formatPrice } from "@/utils/formatPrice";
import "./AiStyleAnalysisPage.scss";

const metadata = createPageMetadata("Phân tích phong cách — UTE Shop");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// -----------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------

const UploadAreaSkeleton = memo(() => (
  <div className="style-skeleton">
    <div className="style-skeleton__header skeleton-shimmer" />
    <div className="style-skeleton__body">
      {["bodyType", "skinTone", "style"].map((k) => (
        <div key={k} className="style-skeleton__tag skeleton-shimmer" />
      ))}
    </div>
    <div className="style-skeleton__products">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="style-skeleton__card skeleton-shimmer" />
      ))}
    </div>
  </div>
));
UploadAreaSkeleton.displayName = "UploadAreaSkeleton";

interface StyleTagProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const StyleTag = memo(({ label, value, icon }: StyleTagProps) => (
  <div className="style-result__tag">
    <span className="style-result__tag-icon" aria-hidden="true">{icon}</span>
    <div>
      <span className="style-result__tag-label">{label}</span>
      <span className="style-result__tag-value">{value}</span>
    </div>
  </div>
));
StyleTag.displayName = "StyleTag";

interface ProductCardProps {
  product: ProductSuggestion;
  onAddToCart: (id: number) => void;
}

const StyleProductCard = memo(({ product, onAddToCart }: ProductCardProps) => (
  <div className="style-product-card">
    <Link to={`/product-detail/${product.id}`} className="style-product-card__img-wrap">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="style-product-card__img"
        />
      ) : (
        <div className="style-product-card__img-placeholder">
          <FiImage size={28} aria-hidden="true" />
        </div>
      )}
    </Link>
    <div className="style-product-card__info">
      <Link
        to={`/product-detail/${product.id}`}
        className="style-product-card__name"
      >
        {product.name}
      </Link>
      {product.reason && (
        <p className="style-product-card__reason">{product.reason}</p>
      )}
      <div className="style-product-card__footer">
        <span className="style-product-card__price">
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          className="tf-btn btn-primary btn-small style-product-card__cart-btn"
          onClick={() => onAddToCart(product.id)}
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
        >
          <FiShoppingCart size={16} aria-hidden="true" />
          <span>Thêm giỏ</span>
        </button>
      </div>
    </div>
  </div>
));
StyleProductCard.displayName = "StyleProductCard";

// -----------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------

export default function AiStyleAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addProductToCart } = useContextElement();

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyze, data, isPending, error, isSuccess, reset } =
    useStyleAnalysis(user?.id);

  const historyIdParam = searchParams.get("historyId");
  const historyIdFromQuery =
    historyIdParam && Number.isFinite(Number(historyIdParam)) && Number(historyIdParam) > 0
      ? Number(historyIdParam)
      : null;

  const stateItem =
    (location.state as { styleHistoryItem?: StyleAnalysisHistoryItem } | null)
      ?.styleHistoryItem ?? null;

  const detailId = stateItem?.id ?? historyIdFromQuery;

  const { data: historyDetail, isLoading: historyDetailLoading, isError: historyDetailError } = useQuery({
    queryKey: detailId != null ? aiStyleHistoryDetailKey(detailId) : ["ai", "history", "style", "detail", "idle"],
    queryFn: () => fetchStyleHistoryDetail(detailId!),
    enabled: !!user && detailId != null,
  });

  const resolvedHistoryItem: StyleAnalysisHistoryItem | null =
    historyDetail ?? stateItem ?? null;

  const historyAsResponse = useMemo((): StyleAnalysisResponse | null => {
    if (!resolvedHistoryItem) return null;
    const conf = resolvedHistoryItem.confidenceScore;
    return {
      gender: resolvedHistoryItem.gender ?? "UNKNOWN",
      bodyType: resolvedHistoryItem.bodyType,
      skinTone: resolvedHistoryItem.skinTone,
      recommendedStyle: resolvedHistoryItem.recommendedStyle,
      confidenceScore: typeof conf === "number" ? conf : 0,
      analyzedImageUrl: resolvedHistoryItem.imageUrl ?? "",
      needsGenderConfirmation: Boolean(resolvedHistoryItem.needsGenderConfirmation),
      products: resolvedHistoryItem.products ?? [],
      fromCache: false,
    };
  }, [resolvedHistoryItem]);

  const displayUploadSrc =
    previewUrl ?? (resolvedHistoryItem?.imageUrl || null);

  const effectiveResult: StyleAnalysisResponse | null =
    isSuccess && data ? data : historyAsResponse;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Chỉ chấp nhận ảnh JPEG, PNG, WebP.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Ảnh quá lớn. Kích thước tối đa 5MB.";
    }
    return null;
  };

  const applyFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    reset();
    navigate({ pathname: location.pathname, search: "", hash: "" }, { replace: true, state: {} });

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  }, [reset, navigate, location.pathname]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
    e.target.value = "";
  }, [applyFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }, [applyFile]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  const handleAnalyze = useCallback(() => {
    if (!selectedFile || isPending) return;
    analyze(selectedFile);
  }, [selectedFile, isPending, analyze]);

  const handleReset = useCallback(() => {
    reset();
    setSelectedFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFileError(null);
    navigate({ pathname: location.pathname, search: "", hash: "" }, { replace: true, state: {} });
  }, [reset, navigate, location.pathname]);

  const handleAddToCart = useCallback((productId: number) => {
    addProductToCart(productId, 1, false);
  }, [addProductToCart]);

  const showResultSkeleton =
    isPending ||
    (Boolean(detailId && user && historyDetailLoading) &&
      !effectiveResult &&
      !error);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />

      {/* Breadcrumb */}
      <div className="tf-breadcrumb">
        <div className="container">
          <ul className="breadcrumb-list">
            <li className="item-breadcrumb">
              <Link to="/" className="text">Trang chủ</Link>
            </li>
            <li className="item-breadcrumb dot"><span /></li>
            <li className="item-breadcrumb">
              <span className="text">Phân tích phong cách</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Toolbar */}
      <section className="flat-spacing-3 pt-2">
        <div className="container">
          <div className="ai-style-toolbar d-flex flex-wrap align-items-center justify-content-between gap-3 mb-0">
            <button
              type="button"
              className="tf-btn btn-out-line-dark btn-small"
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
            >
              <FiArrowLeft size={18} style={{ marginRight: 8 }} aria-hidden="true" />
              Quay lại
            </button>
            <Link to="/ai-stylist" className="tf-btn btn-out-line-primary btn-small">
              Tạo outfit
            </Link>
          </div>
        </div>
      </section>

      <div className="ai-style-page">
        <div className="container">
          {/* Hero */}
          <div className="ai-style-hero">
            <div className="ai-style-hero__badge">
              <FiClock size={16} aria-hidden="true" />
              Phân tích phong cách
            </div>
            <h1 className="ai-style-hero__title">
              Khám phá phong cách
              <span className="d-block ai-style-hero__title--accent mt-1">
                phù hợp với bạn
              </span>
            </h1>
            <p className="ai-style-hero__desc">
              Upload ảnh của bạn — AI sẽ phân tích vóc dáng, tông da và gợi ý
              phong cách cùng sản phẩm phù hợp từ kho hàng UTE Shop.
            </p>
          </div>

          <div className="ai-style-main">
            {/* Upload panel */}
            <div className="ai-style-upload-panel">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="ai-style-file-input"
                onChange={handleFileChange}
                aria-label="Chọn ảnh để phân tích"
              />

              {!displayUploadSrc ? (
                /* Drop zone */
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Kéo thả hoặc click để chọn ảnh"
                  className={`ai-style-dropzone${dragActive ? " ai-style-dropzone--active" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                >
                  <div className="ai-style-dropzone__icon">
                    <FiUploadCloud size={48} aria-hidden="true" />
                  </div>
                  <p className="ai-style-dropzone__title">
                    Kéo thả ảnh vào đây
                  </p>
                  <p className="ai-style-dropzone__sub">
                    hoặc <span className="ai-style-dropzone__browse">chọn file</span>
                  </p>
                  <p className="ai-style-dropzone__hint">
                    JPEG, PNG, WebP · Tối đa 5MB
                  </p>
                </div>
              ) : (
                /* Preview */
                <div className="ai-style-preview">
                  <img
                    src={displayUploadSrc ?? ""}
                    alt="Ảnh đã chọn"
                    className="ai-style-preview__img"
                  />
                  <div className="ai-style-preview__overlay">
                    <button
                      type="button"
                      className="ai-style-preview__change"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiCamera size={16} aria-hidden="true" />
                      Đổi ảnh
                    </button>
                  </div>
                </div>
              )}

              {fileError && (
                <p className="ai-style-file-error" role="alert">{fileError}</p>
              )}

              {/* Actions */}
              <div className="ai-style-actions">
                {displayUploadSrc && !isSuccess && !!selectedFile && (
                  <button
                    type="button"
                    className="tf-btn btn-primary animate-btn ai-style-analyze-btn"
                    onClick={handleAnalyze}
                    disabled={isPending || !selectedFile}
                    aria-busy={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="ai-spinner" aria-hidden="true" />
                        Đang phân tích…
                      </>
                    ) : (
                      <>
                        <FiZap size={18} aria-hidden="true" />
                        Phân tích phong cách
                      </>
                    )}
                  </button>
                )}

                {(isSuccess || displayUploadSrc) && (
                  <button
                    type="button"
                    className="tf-btn btn-out-line-dark btn-small ai-style-reset-btn"
                    onClick={handleReset}
                  >
                    <FiX size={16} aria-hidden="true" />
                    Chọn ảnh mới
                  </button>
                )}
              </div>

              {/* Features list — before analysis */}
              {!displayUploadSrc && !isSuccess && !historyAsResponse && (
                <div className="ai-style-features">
                  {[
                    { icon: <FiUser size={18} aria-hidden />, text: "Phân tích vóc dáng" },
                    { icon: <FiDroplet size={18} aria-hidden />, text: "Nhận diện tông da" },
                    { icon: <FiZap size={18} aria-hidden />, text: "Gợi ý phong cách cá nhân" },
                    { icon: <FiShoppingBag size={18} aria-hidden />, text: "Sản phẩm có thật trong shop" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="ai-style-features__item">
                      <span aria-hidden="true" className="ai-style-features__icon">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Result panel */}
            <div className="ai-style-result-panel">
              {showResultSkeleton && <UploadAreaSkeleton />}

              {!showResultSkeleton && error && (
                <div className="ai-style-error" role="alert">
                  <FiAlertCircle size={22} aria-hidden="true" />
                  <p>Không thể phân tích ảnh lúc này. Vui lòng thử lại.</p>
                  <button
                    type="button"
                    className="tf-btn btn-out-line-dark btn-small"
                    onClick={handleAnalyze}
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!showResultSkeleton && !error && historyDetailError && (
                <div className="ai-style-error" role="alert">
                  <FiAlertCircle size={22} aria-hidden="true" />
                  <p>Không tải được lịch sử phân tích. Vui lòng thử lại sau.</p>
                </div>
              )}

              {!showResultSkeleton && !error && !historyDetailError && effectiveResult && (
                <StyleResult data={effectiveResult} onAddToCart={handleAddToCart} />
              )}

              {!showResultSkeleton && !error && !historyDetailError && !effectiveResult && (
                <div className="ai-style-placeholder">
                  <div className="ai-style-placeholder__icon" aria-hidden="true">
                    <FiUser size={64} strokeWidth={1.25} />
                  </div>
                  <p className="ai-style-placeholder__text">
                    Upload ảnh của bạn để bắt đầu phân tích phong cách
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// -----------------------------------------------------------------------
// StyleResult — result section sau khi phân tích
// -----------------------------------------------------------------------

interface StyleResultProps {
  data: StyleAnalysisResponse;
  onAddToCart: (id: number) => void;
}

const GENDER_LABEL: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  UNISEX: "Unisex",
  UNKNOWN: "Chưa xác định",
};

const StyleResult = memo(({ data, onAddToCart }: StyleResultProps) => {
  const confidencePct = Math.round((data.confidenceScore ?? 0) * 100);
  const genderLabel = data.gender ? (GENDER_LABEL[data.gender] ?? data.gender) : null;

  return (
    <div className="ai-style-result">
      {/* Header */}
      <div className="ai-style-result__header">
        <h2 className="ai-style-result__title">Kết quả phân tích</h2>
        {data.fromCache && (
          <span className="ai-style-cached-badge">Từ bộ nhớ đệm</span>
        )}
      </div>

      {/* Gender confirmation notice */}
      {data.needsGenderConfirmation && (
        <div className="ai-style-gender-notice" role="alert">
          <FiAlertTriangle size={20} aria-hidden="true" />
          <p>
            AI chưa xác định rõ giới tính. Kết quả gợi ý sản phẩm có thể chưa
            chính xác theo giới tính. Bạn có thể thử lại với ảnh rõ nét hơn.
          </p>
        </div>
      )}

      {/* Profile tags */}
      <div className="ai-style-result__tags">
        {genderLabel && data.gender !== "UNKNOWN" && (
          <StyleTag label="Giới tính" value={genderLabel} icon={<FiUser size={18} aria-hidden />} />
        )}
        <StyleTag label="Vóc dáng" value={data.bodyType} icon={<FiActivity size={18} aria-hidden />} />
        <StyleTag label="Tông da" value={data.skinTone} icon={<FiDroplet size={18} aria-hidden />} />
        <StyleTag label="Phong cách" value={data.recommendedStyle} icon={<FiZap size={18} aria-hidden />} />
      </div>

      {/* Confidence bar */}
      <div className="ai-style-confidence">
        <div className="ai-style-confidence__header">
          <span className="ai-style-confidence__label">Độ chính xác</span>
          <span className="ai-style-confidence__value">{confidencePct}%</span>
        </div>
        <div
          className="ai-style-confidence__bar"
          role="progressbar"
          aria-valuenow={confidencePct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="ai-style-confidence__fill"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* Product recommendations */}
      {data.products && data.products.length > 0 && (
        <div className="ai-style-products">
          <h3 className="ai-style-products__title">
            Sản phẩm phù hợp với phong cách
            {genderLabel && data.gender !== "UNKNOWN" ? ` (${genderLabel})` : ""}
          </h3>
          <div className="ai-style-products__grid">
            {data.products.map((product) => (
              <StyleProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
StyleResult.displayName = "StyleResult";
