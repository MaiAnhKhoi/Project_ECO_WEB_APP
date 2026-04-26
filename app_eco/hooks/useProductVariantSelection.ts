import { useEffect, useMemo, useRef, useState } from "react";

import type { ProductColor, ProductVariantSize } from "@/types/product";

export type SizeOption = {
  label: string;
  value: string;
  display: string;
  inStock: boolean;
  variantId: number;
  stockQuantity: number;
};

/**
 * Quản lý lựa chọn màu / size cho trang chi tiết sản phẩm.
 *
 * mappedColors thường được tính bằng useMemo trong caller, nhưng khi deps thay đổi
 * reference mà nội dung giống nhau, effect vẫn chạy. Dùng ref để lưu ID sản phẩm
 * trước đó làm guard thay vì phụ thuộc vào reference của mảng.
 */
export function useProductVariantSelection(mappedColors: ProductColor[]) {
  const [activeColor, setActiveColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  /** Stable key để phát hiện "danh sách màu thực sự thay đổi" (sản phẩm khác). */
  const colorsKeyRef = useRef<string>("");
  const colorsKey = mappedColors.map((c) => c.label).join(",");

  useEffect(() => {
    if (colorsKey === colorsKeyRef.current) return;
    colorsKeyRef.current = colorsKey;

    if (mappedColors.length === 0) {
      setActiveColor("");
      return;
    }
    setActiveColor((prev) => {
      if (prev && mappedColors.some((c) => c.label === prev)) return prev;
      return mappedColors[0].label;
    });
  }, [colorsKey, mappedColors]);

  const sizesForCurrentColor: SizeOption[] = useMemo(() => {
    const selected = mappedColors.find((c) => c.label === activeColor);
    const sizes = selected?.sizes ?? [];
    return sizes.map((s: ProductVariantSize) => ({
      label: s.size,
      value: s.size.toLowerCase(),
      display: s.size,
      inStock: s.inStock,
      variantId: s.variantId,
      stockQuantity: s.stockQuantity,
    }));
  }, [mappedColors, activeColor]);

  useEffect(() => {
    if (sizesForCurrentColor.length === 0) {
      setSelectedSize("");
      return;
    }
    setSelectedSize((prev) => {
      const stillValid = sizesForCurrentColor.some((s) => s.value === prev);
      if (stillValid) return prev;
      return sizesForCurrentColor[0].value;
    });
  }, [sizesForCurrentColor]);

  const currentVariant = useMemo(() => {
    const selected = mappedColors.find((c) => c.label === activeColor);
    if (!selected?.sizes?.length) return null;
    return (
      selected.sizes.find((s) => s.size.toLowerCase() === selectedSize) ?? null
    );
  }, [mappedColors, activeColor, selectedSize]);

  return {
    activeColor,
    setActiveColor,
    selectedSize,
    setSelectedSize,
    sizesForCurrentColor,
    currentVariant,
  };
}
