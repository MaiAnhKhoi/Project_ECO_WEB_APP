import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useChatSession } from "../../hooks/useChat";
import { QUICK_SUGGESTIONS } from "./chatConstants";
import {
  InlineSuggestionCard,
  MessageBubble,
  TypingIndicator,
} from "./ChatMessageParts";

/**
 * Drawer chat AI — trượt từ phải (desktop ~38%), full màn mobile.
 * Floating FAB mở/đóng; Escape hoặc backdrop đóng.
 */
export default function AiChatDrawer() {
  const { pathname } = useLocation();
  const onStylistPage = pathname.startsWith("/ai-stylist");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, clearMessages, isLoading, lastResponse } =
    useChatSession();

  const hasMessages = messages.length > 0;

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
      {!onStylistPage && !isOpen && (
        <Link
          to="/ai-stylist"
          className="ai-outfit-fab"
          title="AI Stylist — gợi ý 3 outfit từ sản phẩm shop"
          aria-label="Mở AI Stylist — tạo outfit"
        >
          <span className="ai-outfit-fab__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="ai-outfit-fab__text">Tạo outfit</span>
        </Link>
      )}

      <button
        type="button"
        className={`ai-chat-toggle ${isOpen ? "ai-chat-toggle--hidden" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="ute-ai-chat-drawer"
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        title="UTE Shop AI"
      >
        <span className="ai-chat-toggle__icon" aria-hidden="true">
          {!isOpen && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.477 2 2 6.256 2 11.5c0 2.577 1.083 4.907 2.839 6.58L4 22l4.28-1.395A10.27 10.27 0 0 0 12 21c5.523 0 10-4.256 10-9.5S17.523 2 12 2Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
        {!isOpen && (
          <span className="ai-chat-toggle__badge" aria-hidden="true">
            AI
          </span>
        )}
      </button>

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.477 2 2 6.256 2 11.5c0 2.577 1.083 4.907 2.839 6.58L4 22l4.28-1.395A10.27 10.27 0 0 0 12 21c5.523 0 10-4.256 10-9.5S17.523 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <p className="ai-chat-header__name">UTE Shop AI</p>
              <p className="ai-chat-header__status">
                <span className="ai-chat-header__dot" aria-hidden="true" />
                Online
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
                <span className="icon icon-reload" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="ai-chat-header__btn ai-chat-header__btn--close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              title="Đóng (Esc)"
            >
              <span className="icon icon-close" aria-hidden="true" />
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="ai-chat-shortcuts__body">
                <span className="ai-chat-shortcuts__title">AI Stylist</span>
                <span className="ai-chat-shortcuts__sub">
                  Gợi ý 3 outfit từ sản phẩm có trong shop
                </span>
              </span>
              <span className="ai-chat-shortcuts__chev" aria-hidden="true">
                →
              </span>
            </Link>
            <p className="ai-chat-shortcuts__hint">
              Bạn đang chat — tiếp tục hỏi bên dưới, hoặc chuyển sang tạo outfit.
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
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.477 2 2 6.256 2 11.5c0 2.577 1.083 4.907 2.839 6.58L4 22l4.28-1.395A10.27 10.27 0 0 0 12 21c5.523 0 10-4.256 10-9.5S17.523 2 12 2Z"
                    fill="var(--primary)"
                  />
                </svg>
              </div>
              <h3 className="ai-chat-welcome__title">Xin chào 👋</h3>
              <p className="ai-chat-welcome__desc">
                Trợ lý mua sắm của UTE Shop — hỏi sản phẩm, outfit hoặc chính
                sách shop. Chọn gợi ý bên dưới hoặc nhập tin nhắn.
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                  fill="currentColor"
                />
              </svg>
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
