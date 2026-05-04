import React, { useCallback, useRef, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiStar,
} from "react-icons/fi";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";
import { useContextElement } from "@/context/Context";
import { useOutfitGenerator } from "../hooks/useRecommendations";
import { OutfitResultCard } from "../components/stylist/OutfitResultCard";
import "./AiStylistPage.scss";

const metadata = createPageMetadata("Tạo outfit với AI — UTE Shop");

const OutfitSkeletonGrid = memo(() => (
  <div className="ai-outfit-skeleton">
    {[1, 2, 3].map((n) => (
      <div key={n} className="ai-outfit-skeleton__card">
        <div className="ai-outfit-skeleton__header skeleton-shimmer" />
        <div className="ai-outfit-skeleton__items">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ai-outfit-skeleton__item">
              <div className="ai-outfit-skeleton__img skeleton-shimmer" />
              <div className="ai-outfit-skeleton__lines">
                <div
                  className="skeleton-shimmer"
                  style={{ height: 12, width: "70%", borderRadius: 4 }}
                />
                <div
                  className="skeleton-shimmer"
                  style={{
                    height: 10,
                    width: "40%",
                    borderRadius: 4,
                    marginTop: 6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="skeleton-shimmer"
          style={{ height: 44, borderRadius: 99, marginTop: 16 }}
        />
      </div>
    ))}
  </div>
));
OutfitSkeletonGrid.displayName = "OutfitSkeletonGrid";

const PROMPT_EXAMPLES = [
  "Outfit đi biển mùa hè dưới 2 triệu",
  "Set đồ đi làm công sở lịch sự",
  "Bộ trang phục dạo phố cuối tuần",
  "Outfit dự tiệc cưới sang trọng",
  "Set thể thao năng động dưới 800k",
];

export default function AiStylistPage() {
  const navigate = useNavigate();
  const { addProductToCart } = useContextElement();
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: generate, data, isPending, error, isSuccess, reset } =
    useOutfitGenerator();

  const displayData = isSuccess && data ? data : null;

  const handleAddItemsToCart = useCallback(
    (productIds: number[]) => {
      let delay = 0;
      productIds.forEach((id) => {
        window.setTimeout(() => {
          addProductToCart(id, 1, false);
        }, delay);
        delay += 180;
      });
    },
    [addProductToCart]
  );

  const handleGenerate = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed || isPending) return;
    generate({ prompt: trimmed });
  }, [prompt, isPending, generate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const handleExample = useCallback(
    (text: string) => {
      setPrompt(text);
      reset();
      window.setTimeout(() => inputRef.current?.focus(), 0);
    },
    [reset]
  );

  const showSkeleton = isPending;
  const showMutationError = Boolean(error);
  const showFeaturesCta =
    !showSkeleton && !displayData && !showMutationError;

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <div className="tf-breadcrumb">
        <div className="container">
          <ul className="breadcrumb-list">
            <li className="item-breadcrumb">
              <Link to="/" className="text">
                Trang chủ
              </Link>
            </li>
            <li className="item-breadcrumb dot">
              <span />
            </li>
            <li className="item-breadcrumb">
              <span className="text">Tạo outfit</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="flat-spacing-3 pt-2">
        <div className="container">
          <div className="ai-stylist-toolbar d-flex flex-wrap align-items-center justify-content-between gap-3 mb-0">
            <button
              type="button"
              className="tf-btn btn-out-line-dark btn-small"
              onClick={() => navigate(-1)}
              aria-label="Quay lại trang trước"
            >
              <FiArrowLeft size={18} style={{ marginRight: 8 }} aria-hidden="true" />
              Quay lại
            </button>
            <Link
              to="/"
              className="tf-btn btn-out-line-primary btn-small"
              aria-label="Về trang chủ"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </section>

      <div className="ai-stylist-page">
        <div className="container">
          <div className="ai-stylist-hero">
            <div className="ai-stylist-hero__badge">
              <FiStar size={16} strokeWidth={2} aria-hidden="true" />
              Tạo outfit với AI
            </div>
            <h1 className="ai-stylist-hero__title">
              Gợi ý outfit theo sản phẩm thật
              <span className="d-block ai-stylist-hero__title--accent mt-1">
                tại UTE Shop
              </span>
            </h1>
            <p className="ai-stylist-hero__desc">
              Mô tả phong cách, dịp và ngân sách — nhận 3 outfit gợi ý từ kho
              hàng hiện có.
            </p>
          </div>

          <div className="ai-stylist-input-box">
            <div className="ai-stylist-input-wrap">
              <textarea
                ref={inputRef}
                className="ai-stylist-textarea"
                placeholder="Ví dụ: Outfit đi biển năng động, ngân sách dưới 2 triệu..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                disabled={isPending}
                aria-label="Mô tả yêu cầu outfit"
                maxLength={500}
              />
              <div className="ai-stylist-input-actions">
                <span className="ai-stylist-char-count" aria-live="polite">
                  {prompt.length}/500
                </span>
                <button
                  type="button"
                  className="tf-btn btn-primary animate-btn ai-stylist-generate-btn"
                  onClick={handleGenerate}
                  disabled={isPending || !prompt.trim()}
                  aria-label="Tạo outfit"
                >
                  {isPending ? (
                    <>
                      <span className="ai-spinner" aria-hidden="true" />
                      Đang tạo…
                    </>
                  ) : (
                    <>
                      <FiStar size={18} strokeWidth={2} aria-hidden="true" />
                      Tạo outfit
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="ai-stylist-examples">
              <span className="ai-stylist-examples__label">Gợi ý nhanh:</span>
              {PROMPT_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  className="ai-stylist-examples__chip"
                  onClick={() => handleExample(ex)}
                  disabled={isPending}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {showSkeleton && <OutfitSkeletonGrid />}

          {showMutationError ? (
            <div className="ai-stylist-error" role="alert">
              <FiAlertCircle size={22} aria-hidden="true" />
              <p>Không thể tạo outfit lúc này. Vui lòng thử lại sau.</p>
            </div>
          ) : null}

          {displayData ? (
            <div className="ai-stylist-results">
              <div className="ai-stylist-results__header">
                <h2 className="ai-stylist-results__title">3 outfit gợi ý</h2>
                <p className="ai-stylist-results__prompt">
                  <em>&ldquo;{displayData.originalPrompt}&rdquo;</em>
                </p>
                {displayData.fromCache ? (
                  <span className="ai-stylist-cached-badge">Từ bộ nhớ đệm</span>
                ) : null}
              </div>

              {displayData.outfits.length === 0 ? (
                <div className="ai-stylist-empty">
                  <p>Chưa có outfit phù hợp. Thử mô tả khác nhé.</p>
                  <button
                    type="button"
                    className="tf-btn btn-out-line-dark btn-small"
                    onClick={() => {
                      setPrompt("");
                      reset();
                      inputRef.current?.focus();
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              ) : (
                <div className="ai-outfit-grid">
                  {displayData.outfits.map((outfit) => (
                    <OutfitResultCard
                      key={outfit.outfitNumber}
                      outfit={outfit}
                      onAddItemsToCart={handleAddItemsToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {showFeaturesCta ? (
            <div className="ai-stylist-cta">
              <div className="ai-stylist-cta__features">
                {[
                  {
                    icon: "icon-star",
                    text: "Sản phẩm có thật trong shop",
                  },
                  { icon: "icon-check", text: "Theo ngân sách bạn nêu" },
                  { icon: "icon-cart2", text: "Thêm cả bộ vào giỏ nhanh" },
                ].map(({ icon, text }) => (
                  <div key={text} className="ai-stylist-cta__feature">
                    <span className={`icon ${icon}`} aria-hidden="true" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </>
  );
}
