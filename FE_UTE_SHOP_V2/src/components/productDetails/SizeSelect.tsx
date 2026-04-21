"use client";
import { useState, useEffect } from "react";
import type { Size } from "@/types";

interface SizePickerProps {
  sizes?: Size[];                     // danh sách size từ product
  activeSize?: string;                // size đang chọn (optional)
  setActiveSize?: (value: string) => void; // callback khi chọn size
}

const SizePicker = ({ sizes = [], activeSize: propActiveSize, setActiveSize }: SizePickerProps) => {
  const [currentSize, setCurrentSize] = useState("");   // hiển thị
  const [selectedSize, setSelectedSize] = useState(""); // state nội bộ

  // Cập nhật size mặc định khi sizes hoặc propActiveSize thay đổi
  useEffect(() => {
    if (sizes.length === 0) return;

    const defaultSize = sizes[0];
    const initialSize = propActiveSize || defaultSize.value;
    setSelectedSize(initialSize);

    // tìm display tương ứng
    const display = sizes.find((s) => s.value === initialSize)?.display || defaultSize.display;
    setCurrentSize(display);
  }, [sizes, propActiveSize]);

  const handleSizeClick = (size: Size) => {
    setSelectedSize(size.value);
    setCurrentSize(size.display);
    if (setActiveSize) setActiveSize(size.value);
  };

  return (
    <div className="variant-picker-item variant-size">
      <div className="variant-picker-label">
        <div>
          Kích thước:
          <span className="variant-picker-label-value value-currentSize">
            {currentSize}
          </span>
        </div>
        <a href="#sizeGuide" data-bs-toggle="modal" className="size-guide link">
          Hướng dẫn chọn size
        </a>
      </div>
      <div className="variant-picker-values">
        {sizes.map((size) => (
          <span
            key={size.value}
            className={`size-btn ${selectedSize === size.value ? "active" : ""}`}
            data-size={size.value}
            onClick={() => handleSizeClick(size)}
          >
            {size.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SizePicker;
