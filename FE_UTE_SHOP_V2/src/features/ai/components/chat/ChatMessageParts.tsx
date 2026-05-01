import { memo } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import type { ChatMessage, ProductSuggestion } from "../../types";

export const TypingIndicator = memo(() => (
  <div className="ai-chat-bubble ai-chat-bubble--assistant">
    <div className="ai-typing-indicator" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  </div>
));
TypingIndicator.displayName = "TypingIndicator";

export const MessageBubble = memo(({ msg }: { msg: ChatMessage }) => (
  <div
    className={`ai-chat-bubble ai-chat-bubble--${msg.role}`}
    role="listitem"
  >
    {msg.role === "assistant" && (
      <div className="ai-chat-bubble__avatar" aria-hidden="true">
        <span className="icon icon-star" />
      </div>
    )}
    <div className="ai-chat-bubble__body">
      <p className="ai-chat-bubble__text">{msg.content}</p>
    </div>
  </div>
));
MessageBubble.displayName = "MessageBubble";

export const InlineSuggestionCard = memo(
  ({ product }: { product: ProductSuggestion }) => (
    <Link to={`/product-detail/${product.id}`} className="ai-inline-product">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="ai-inline-product__img"
          loading="lazy"
          width={48}
          height={48}
        />
      )}
      <div className="ai-inline-product__info">
        <span className="ai-inline-product__name">{product.name}</span>
        <span className="ai-inline-product__price">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  )
);
InlineSuggestionCard.displayName = "InlineSuggestionCard";
