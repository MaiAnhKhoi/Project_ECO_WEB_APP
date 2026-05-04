import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";
import { useContextElement } from "@/context/Context";
import { fetchOutfitHistoryDetail } from "../api/aiApi";
import { aiOutfitHistoryDetailKey } from "../queryKeys";
import { OutfitResultCard } from "../components/stylist/OutfitResultCard";
import "./AiStylistPage.scss";

const metadata = createPageMetadata("Chi tiết outfit — UTE Shop");

export default function AiOutfitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const logId = useMemo(() => {
    const n = id ? Number(id) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  const { addProductToCart } = useContextElement();

  const { data, isPending, isError } = useQuery({
    queryKey: logId != null ? aiOutfitHistoryDetailKey(logId) : ["ai", "outfit-detail", "idle"],
    queryFn: () => fetchOutfitHistoryDetail(logId!),
    enabled: logId != null,
  });

  const handleAddItemsToCart = useCallback(
    (productIds: number[]) => {
      let delay = 0;
      productIds.forEach((productId) => {
        window.setTimeout(() => {
          addProductToCart(productId, 1, false);
        }, delay);
        delay += 180;
      });
    },
    [addProductToCart]
  );

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
              <Link to="/ai-stylist" className="text">
                Tạo outfit
              </Link>
            </li>
            <li className="item-breadcrumb dot">
              <span />
            </li>
            <li className="item-breadcrumb">
              <span className="text">Chi tiết outfit</span>
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
              aria-label="Quay lại"
            >
              <FiArrowLeft size={18} style={{ marginRight: 8 }} aria-hidden="true" />
              Quay lại
            </button>
            <Link to="/ai-stylist" className="tf-btn btn-out-line-primary btn-small">
              Tạo outfit mới
            </Link>
          </div>
        </div>
      </section>

      <div className="ai-stylist-page">
        <div className="container">
          {!logId ? (
            <div className="ai-stylist-error" role="alert">
              <FiAlertCircle size={22} aria-hidden="true" />
              <p>Đường dẫn không hợp lệ.</p>
            </div>
          ) : null}

          {logId && isPending ? (
            <p className="text-center text-muted py-5">Đang tải outfit…</p>
          ) : null}

          {logId && isError ? (
            <div className="ai-stylist-error" role="alert">
              <FiAlertCircle size={22} aria-hidden="true" />
              <p>Không tải được outfit từ lịch sử. Vui lòng thử lại.</p>
            </div>
          ) : null}

          {logId && data ? (
            <div className="ai-stylist-results" style={{ marginTop: 8 }}>
              <div className="ai-stylist-results__header">
                <h1 className="ai-stylist-results__title h2">Outfit AI đã tạo</h1>
                <p className="ai-stylist-results__prompt mb-0">
                  <em>&ldquo;{data.originalPrompt}&rdquo;</em>
                </p>
                {data.fromCache ? (
                  <span className="ai-stylist-cached-badge">Từ bộ nhớ đệm</span>
                ) : null}
              </div>
              {data.outfits.length === 0 ? (
                <p className="text-muted" role="status">
                  Không thể hiển thị các món trong outfit (dữ liệu JSON hoặc sản phẩm tham chiếu). Hãy tải lại
                  trang sau khi cập nhật server, hoặc tạo outfit mới với cùng mô tả.
                </p>
              ) : (
                <div className="ai-outfit-grid">
                  {data.outfits.map((outfit) => (
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
        </div>
      </div>

      <Footer />
    </>
  );
}
