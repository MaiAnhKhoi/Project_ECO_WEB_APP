"use client";
import type { QuantitySelectProps } from "@/types";

export default function QuantitySelect({
  quantity = 1,
  max = 999,
  setQuantity = () => {},
  styleClass = "",
}: QuantitySelectProps) {
  const clamp = (n: number) => Math.min(Math.max(1, n), max);

  return (
    <>
      <div className={`wg-quantity ${styleClass} `}>
        <button
          className="btn-quantity minus-btn"
          onClick={() => setQuantity(clamp(quantity > 1 ? quantity - 1 : quantity))}
        >
          -
        </button>
        <input
          className="quantity-product font-4"
          type="number"
          name="number"
          value={quantity}
          min={1}
          max={max}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              setQuantity(clamp(value));
            }
          }}
        />
        <span
          className="btn-quantity plus-btn"
          onClick={() => setQuantity(clamp(quantity + 1))}
          role="button"
          tabIndex={0}
        >
          +
        </span>
      </div>
    </>
  );
}
