import type { ProductColor } from "@/types/product";

const isHex = (value?: string | null) =>
  Boolean(value && /^#?[0-9a-f]{3,6}$/i.test(value.trim()));

const normalizeHex = (value: string) => (value.startsWith("#") ? value : `#${value}`);

/** Suy màu từ tên (tiếng Việt / Anh) khi BE không trả hex — cùng ý tưởng với web. */
export function guessHexFromColorName(name?: string | null): string {
  if (!name) return "#cccccc";
  const n = name.toLowerCase();
  if (n.includes("đen") || n.includes("black")) return "#000000";
  if (n.includes("trắng") || n.includes("white") || n.includes("trong")) return "#ffffff";
  if (n.includes("xám") || n.includes("ghi") || n.includes("gray")) return "#808080";
  if (n.includes("đỏ")) return "#ff0000";
  if (n.includes("hồng")) return "#ff69b4";
  if (n.includes("cam")) return "#ff8c00";
  if (n.includes("vàng")) return "#ffd700";
  if (n.includes("xanh lá") || n.includes("green")) return "#00a86b";
  if (n.includes("xanh dương") || n.includes("blue")) return "#005bbb";
  if (n.includes("nâu")) return "#8b4513";
  if (n.includes("tím") || n.includes("purple")) return "#800080";
  return "#cccccc";
}

const CSS_CLASS_TO_HEX: Record<string, string> = {
  "bg-white": "#FFFFFF",
  "bg-black": "#000000",
  "bg-light": "#F3F4F6",
  "bg-gray": "#9CA3AF",
  "bg-grey": "#9CA3AF",
  // BE mapper defaults (bootstrap-ish)
  "bg-primary": "#2563EB",
  "bg-secondary": "#9CA3AF",
  "bg-success": "#16A34A",
  "bg-danger": "#DC2626",
  "bg-warning": "#F59E0B",
  "bg-dark": "#111827",
  "bg-red": "#EF4444",
  "bg-blue": "#3B82F6",
  "bg-green": "#22C55E",
  "bg-yellow": "#EAB308",
  "bg-brown": "#8B5A2B",
  "bg-beige": "#F5F5DC",
  "bg-pink": "#EC4899",
  "bg-purple": "#A855F7",
};

export function resolveColorHex(color: ProductColor): string | null {
  const hex = color.colorHex ?? color.hex ?? null;
  if (hex && hex.trim()) {
    const v = hex.trim();
    return v.startsWith("#") ? v : `#${v}`;
  }

  const css = (color.colorCssClass ?? color.value ?? "").trim();
  if (!css) return null;
  return CSS_CLASS_TO_HEX[css] ?? null;
}

/** Ưu tiên hex → class map → đoán từ tên (dùng khi map màu chi tiết sản phẩm). */
export function resolveColorHexFlexible(input: {
  hex?: string | null;
  cssClass?: string | null;
  fallbackName?: string | null;
}): string {
  const rawHex = input.hex?.trim();
  if (rawHex && isHex(rawHex)) {
    return normalizeHex(rawHex);
  }
  const cls = input.cssClass?.trim();
  if (cls) {
    if (isHex(cls)) return normalizeHex(cls);
    const mapped = CSS_CLASS_TO_HEX[cls];
    if (mapped) return mapped;
  }
  return guessHexFromColorName(input.fallbackName);
}

