import { useState, type ElementType } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiCamera,
  FiChevronRight,
  FiInbox,
  FiMessageCircle,
  FiShoppingBag,
} from "react-icons/fi";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";
import {
  fetchChatHistory,
  fetchOutfitHistory,
  fetchStyleHistory,
} from "../api/aiApi";
import type { StyleAnalysisHistoryItem, RecommendationHistory } from "../types";
import { formatPrice } from "@/utils/formatPrice";
import "./AiHistoryPage.scss";

const metadata = createPageMetadata("Lịch sử AI — UTE Shop");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const GENDER_LABEL: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  UNISEX: "Unisex",
  UNKNOWN: "Chưa xác định",
};

function HistorySkeleton() {
  return (
    <div className="ai-dash__skeleton-list">
      {[1, 2, 3].map((k) => (
        <div key={k} className="ai-dash__skeleton-card" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="ai-dash__empty">
      <FiInbox className="ai-dash__empty-svg" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

function StyleHistoryTab() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["ai", "history", "style"],
    queryFn: () => fetchStyleHistory(0, 20),
  });

  if (isLoading) return <HistorySkeleton />;
  if (!data?.content?.length) {
    return (
      <EmptyState message="Chưa có lịch sử phân tích phong cách nào." />
    );
  }

  return (
    <div className="ai-dash__grid">
      {data.content.map((item: StyleAnalysisHistoryItem) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          className="ai-dash__card ai-dash__card--style ai-dash__card--clickable"
          onClick={() =>
            navigate(`/ai-style-analysis?historyId=${item.id}`)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/ai-style-analysis?historyId=${item.id}`);
            }
          }}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="ai-dash__card-img"
            />
          ) : null}
          <div className="ai-dash__card-body">
            <div className="ai-dash__tag-row">
              {item.gender && item.gender !== "UNKNOWN" ? (
                <span className="ai-dash__tag ai-dash__tag--gender">
                  {GENDER_LABEL[item.gender] ?? item.gender}
                </span>
              ) : null}
              {item.bodyType ? (
                <span className="ai-dash__tag">{item.bodyType}</span>
              ) : null}
              {item.skinTone ? (
                <span className="ai-dash__tag">{item.skinTone}</span>
              ) : null}
            </div>
            <p className="ai-dash__card-style">{item.recommendedStyle}</p>
            <span className="ai-dash__date">{formatDate(item.createdAt)}</span>
            <span className="ai-dash__card-open-hint">
              Xem lại kết quả <FiChevronRight size={14} aria-hidden />
            </span>
            {item.products && item.products.length > 0 ? (
              <div className="ai-dash__card-products">
                <p className="ai-dash__card-products-title">Sản phẩm gợi ý</p>
                <div className="ai-dash__card-products-scroll">
                  {item.products.slice(0, 8).map((p) => (
                    <Link
                      key={p.id}
                      to={`/product-detail/${p.id}`}
                      className="ai-dash__mini-p"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="ai-dash__mini-p-img"
                        />
                      ) : (
                        <div className="ai-dash__mini-p-img ai-dash__mini-p-img--ph" />
                      )}
                      <span className="ai-dash__mini-p-name">{p.name}</span>
                      <span className="ai-dash__mini-p-price">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatHistoryTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["ai", "chat", "history", 0],
    queryFn: () => fetchChatHistory(0, 20),
  });

  if (isLoading) return <HistorySkeleton />;
  if (!data?.content?.length) {
    return <EmptyState message="Chưa có cuộc trò chuyện nào." />;
  }

  return (
    <div className="ai-dash__list">
      {data.content.map((item) => (
        <Link
          key={item.conversationId}
          to={{ search: createSearchParams({ aiConversation: String(item.conversationId) }).toString() }}
          className="ai-dash__list-item ai-dash__list-item--link ai-dash__list-item--chat"
        >
          <span className="ai-dash__list-accent ai-dash__list-accent--chat" aria-hidden />
          <span className="ai-dash__list-ico ai-dash__list-ico--chat">
            <FiMessageCircle size={20} aria-hidden />
          </span>
          <div className="ai-dash__list-body">
            <span className="ai-dash__list-type">Chat AI</span>
            <p className="ai-dash__list-title">
              {item.title ?? "Cuộc trò chuyện"}
            </p>
            <div className="ai-dash__list-footer">
              <span className="ai-dash__date-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {formatDate(item.createdAt)}
              </span>
              <span className="ai-dash__cta-chip ai-dash__cta-chip--chat">Tiếp tục →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function OutfitHistoryTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["ai", "history", "outfits"],
    queryFn: () => fetchOutfitHistory(0, 20),
  });

  if (isLoading) return <HistorySkeleton />;
  if (!data?.content?.length) {
    return <EmptyState message="Chưa có outfit nào do AI tạo. Hãy thử Tạo outfit trên trang stylist." />;
  }

  return (
    <div className="ai-dash__list">
      {data.content.map((item: RecommendationHistory) => (
        <Link
          key={item.id}
          to={`/ai-outfit/${item.id}`}
          className="ai-dash__list-item ai-dash__list-item--link ai-dash__list-item--outfit"
        >
          <span className="ai-dash__list-accent ai-dash__list-accent--outfit" aria-hidden />
          <span className="ai-dash__list-ico ai-dash__list-ico--outfit">
            <FiShoppingBag size={20} aria-hidden />
          </span>
          <div className="ai-dash__list-body">
            <span className="ai-dash__list-type ai-dash__list-type--outfit">Outfit AI</span>
            <p className="ai-dash__list-title">
              {item.userPrompt ? `"${item.userPrompt}"` : "Tạo outfit"}
            </p>
            <div className="ai-dash__list-meta">
              {item.cacheHit ? (
                <span className="ai-dash__meta-tag ai-dash__meta-tag--cache">⚡ Từ đệm AI</span>
              ) : null}
              {item.tokensUsed != null ? (
                <span className="ai-dash__meta-tag">
                  {item.tokensUsed} token
                </span>
              ) : null}
            </div>
            <div className="ai-dash__list-footer">
              <span className="ai-dash__date-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {formatDate(item.createdAt)}
              </span>
              <span className="ai-dash__cta-chip ai-dash__cta-chip--outfit">Xem outfit →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

type TabId = "style" | "chat" | "outfits";

const TABS: { id: TabId; label: string; icon: ElementType }[] = [
  { id: "style", label: "Phân tích phong cách", icon: FiCamera },
  { id: "chat", label: "Lịch sử trò chuyện", icon: FiMessageCircle },
  { id: "outfits", label: "Outfit từ AI", icon: FiShoppingBag },
];

export default function AiHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("style");

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
              <span className="text">Lịch sử AI</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ai-dash">
        <div className="ai-dash__hero">
          <h1 className="ai-dash__hero-title">Lịch sử AI Fashion</h1>
          <p className="ai-dash__hero-sub">
            Trò chuyện, tạo outfit và phân tích phong cách — xem lại mỗi lần
            dùng
          </p>
          <div className="ai-dash__hero-actions">
            <Link
              to="/ai-style-analysis"
              className="ai-dash__btn ai-dash__btn--primary"
            >
              Phân tích phong cách
            </Link>
            <Link
              to="/ai-stylist"
              className="ai-dash__btn ai-dash__btn--outline"
            >
              Tạo outfit
            </Link>
          </div>
        </div>

        <div className="ai-dash__tabs-wrap">
          <div className="ai-dash__tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`ai-dash__tab ${activeTab === tab.id ? "ai-dash__tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="ai-dash__tab-inner">
                    <Icon size={16} strokeWidth={2} aria-hidden />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ai-dash__content">
          {activeTab === "style" ? <StyleHistoryTab /> : null}
          {activeTab === "chat" ? <ChatHistoryTab /> : null}
          {activeTab === "outfits" ? <OutfitHistoryTab /> : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
