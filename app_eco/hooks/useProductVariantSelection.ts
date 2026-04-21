import { useEffect, useMemo, useState } from "react";

import type { ProductColor, ProductVariantSize } from "@/types/product";

export type SizeOption = {
  label: string;
  value: string;
  display: string;
  inStock: boolean;
  variantId: number;
  stockQuantity: number;
};

export function useProductVariantSelection(mappedColors: ProductColor[]) {
  const [activeColor, setActiveColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (mappedColors.length === 0) {
      setActiveColor("");
      return;
    }
    setActiveColor((prev) => {
      if (prev && mappedColors.some((c) => c.label === prev)) return prev;
      return mappedColors[0].label;
    });
  }, [mappedColors]);

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
    const first = sizesForCurrentColor[0];
    setSelectedSize((prev) => {
      const stillValid = sizesForCurrentColor.some((s) => s.value === prev);
      if (stillValid) return prev;
      return first.value;
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
