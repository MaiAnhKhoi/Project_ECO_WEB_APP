import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useChatSession } from "../../hooks/useChat";
import { QUICK_SUGGESTIONS } from "./chatConstants";
import {
  InlineSuggestionCard,
  MessageBubble,
  TypingIndicator,
} from "./ChatMessageParts";
import {
  FiChevronRight,
  FiMessageCircle,
  FiRefreshCw,
  FiSend,
  FiStar,
  FiX,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

/**
 * Drawer chat AI — trượt từ phải (desktop ~38%), full màn mobile.
 * Floating FAB mở/đóng; Escape hoặc backdrop đóng.
 */
export default function AiChatDrawer() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const onStylistPage = pathname.startsWith("/ai-stylist");
  const [isOpen, setIsOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, clearMessages, loadConversation, isLoading, lastResponse } =
    useChatSession();

  const hasMessages = messages.length > 0;
  const convIdParam = searchParams.get("aiConversation");

  useEffect(() => {
    if (!convIdParam) return;
    const id = Number(convIdParam);
    if (!Number.isFinite(id)) return;
    let cancelled = false;
    (async () => {
      try {
        await loadConversation(id);
        if (!cancelled) {
          setIsOpen(true);
          setHubOpen(false);
        }
      } catch {
        /* network / auth */
      } finally {
        if (!cancelled) {
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.delete("aiConversation");
              return next;
            },
            { replace: true }
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [convIdParam, loadConversation, setSearchParams]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    sendMessage(trimmed);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleQuickSuggestion = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleNewChat = useCallback(() => {
    clearMessages();
    setInputValue("");
  }, [clearMessages]);

  return (
    <>
      {!isOpen && (
        <div
          className={`ai-floating-hub ${hubOpen ? "ai-floating-hub--open" : ""}`}
        >
          <div className="ai-floating-hub__menu" aria-hidden={!hubOpen}>
            <button
              type="button"
              className="ai-floating-hub__action"
              onClick={() => {
                setHubOpen(false);
                setIsOpen(true);
              }}
            >
              <FiMessageCircle size={20} strokeWidth={2} aria-hidden />
              <span>Chat AI</span>
            </button>
            <Link
              to="/ai-stylist"
              className="ai-floating-hub__action"
              onClick={() => setHubOpen(false)}
            >
              <FiStar size={20} strokeWidth={2} aria-hidden />
              <span>Tạo outfit</span>
            </Link>
            <Link
              to="/ai-style-analysis"
              className="ai-floating-hub__action"
              onClick={() => setHubOpen(false)}
            >
              <HiOutlineSparkles size={22} aria-hidden />
              <span>Phân tích ảnh</span>
            </Link>
          </div>
          <button
            type="button"
            className="ai-floating-hub__main"
            aria-expanded={hubOpen}
            aria-controls="ute-ai-floating-menu"
            onClick={() => setHubOpen((v) => !v)}
            aria-label={hubOpen ? "Thu gọn menu AI" : "Mở menu AI"}
          >
            <span className="ai-floating-hub__main-text">AI</span>
          </button>
          <div id="ute-ai-floating-menu" className="visually-hidden">
            Menu tính năng trợ lý AI
          </div>
        </div>
      )}

      <div
        className={`ai-chat-drawer-backdrop ${isOpen ? "ai-chat-drawer-backdrop--visible" : ""}`}
        onClick={() => setIsOpen(false)}
        onKeyDown={() => {}}
        role="presentation"
        aria-hidden={!isOpen}
      />

      <div
        ref={drawerRef}
        id="ute-ai-chat-drawer"
        className={`ai-chat-drawer ${isOpen ? "ai-chat-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="UTE Shop AI"
        aria-hidden={!isOpen}
      >
        <header className="ai-chat-header">
          <div className="ai-chat-header__info">
            <div className="ai-chat-header__avatar" aria-hidden="true">
              <FiMessageCircle size={20} strokeWidth={2} color="#fff" />
            </div>
            <div>
              <p className="ai-chat-header__name">UTE Shop AI</p>
              <p className="ai-chat-header__status">
                <span className="ai-chat-header__dot" aria-hidden="true" />
                Đang hoạt động
              </p>
            </div>
          </div>
          <div className="ai-chat-header__actions">
            {hasMessages && (
              <button
                type="button"
                className="ai-chat-header__btn"
                onClick={handleNewChat}
                title="Cuộc trò chuyện mới"
                aria-label="Cuộc trò chuyện mới"
              >
                <FiRefreshCw size={18} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="ai-chat-header__btn ai-chat-header__btn--close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              title="Đóng (Esc)"
            >
              <FiX size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        {!onStylistPage && (
          <div className="ai-chat-shortcuts">
            <Link
              to="/ai-stylist"
              className="ai-chat-shortcuts__card"
              onClick={() => setIsOpen(false)}
            >
              <span className="ai-chat-shortcuts__badge" aria-hidden="true">
                <FiStar size={18} strokeWidth={2} />
              </span>
              <span className="ai-chat-shortcuts__body">
                <span className="ai-chat-shortcuts__title">Tạo outfit</span>
                <span className="ai-chat-shortcuts__sub">
                  Gợi ý 3 bộ outfit từ sản phẩm trong shop
                </span>
              </span>
              <span className="ai-chat-shortcuts__chev" aria-hidden="true">
                <FiChevronRight size={20} />
              </span>
            </Link>
            <p className="ai-chat-shortcuts__hint">
              Tiếp tục hỏi bên dưới hoặc chuyển sang tạo outfit.
            </p>
          </div>
        )}

        <div
          className="ai-chat-messages"
          role="list"
          aria-live="polite"
          aria-atomic="false"
        >
          {!hasMessages ? (
            <div className="ai-chat-welcome">
              <div className="ai-chat-welcome__icon" aria-hidden="true">
                <FiMessageCircle size={40} strokeWidth={1.75} style={{ color: "var(--primary)" }} />
              </div>
              <h3 className="ai-chat-welcome__title">Xin chào</h3>
              <p className="ai-chat-welcome__desc">
                Trợ lý mua sắm UTE Shop — hỏi sản phẩm, outfit hoặc chính sách.
                Chọn gợi ý bên dưới hoặc nhập tin nhắn.
              </p>
              <div className="ai-chat-suggestions" role="list">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="ai-chat-suggestions__chip"
                    onClick={() => handleQuickSuggestion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <React.Fragment key={`${msg.role}-${i}-${msg.createdAt ?? ""}`}>
                  <MessageBubble msg={msg} />
                  {msg.role === "assistant" &&
                    i === messages.length - 1 &&
                    lastResponse?.suggestedProducts?.length ? (
                    <div className="ai-chat-product-suggestions" role="list">
                      {lastResponse.suggestedProducts.slice(0, 3).map((p) => (
                        <InlineSuggestionCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <div className="ai-chat-input-area">
          <textarea
            ref={inputRef}
            className="ai-chat-input"
            placeholder="Nhập câu hỏi, Shift+Enter xuống dòng…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            aria-label="Nội dung tin nhắn"
            maxLength={2000}
          />
          <button
            type="button"
            className="tf-btn btn-primary ai-chat-send-btn"
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Gửi tin nhắn"
            title="Gửi (Enter)"
          >
            {isLoading ? (
              <span className="ai-chat-send-btn__spinner" aria-hidden="true" />
            ) : (
              <FiSend size={18} aria-hidden="true" />
            )}
            <span className="ai-chat-send-btn__label">Gửi</span>
          </button>
        </div>

        <div className="ai-chat-footer-bar">
          <span className="ai-chat-footer-bar__kbd">Enter để gửi</span>
          {!onStylistPage && (
            <Link
              to="/ai-stylist"
              className="ai-chat-footer-bar__outfit-link"
              onClick={() => setIsOpen(false)}
            >
              Tạo outfit
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
