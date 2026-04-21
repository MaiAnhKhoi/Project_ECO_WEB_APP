import { BOOTSTRAP_COLORS } from "@/data/bootstrapColors";

const COLOR_CLASS_MAP = new Map(
  BOOTSTRAP_COLORS.map((item) => [item.cssClass, item.hex]),
);

const isHex = (value?: string | null) =>
  Boolean(value && /^#?[0-9a-f]{3,6}$/i.test(value.trim()));

const normalizeHex = (value: string) =>
  value.startsWith("#") ? value : `#${value}`;

const guessHexFromName = (name?: string | null) => {
  if (!name) return "#cccccc";
  const n = name.toLowerCase();

  // Black / White / Gray family
  if (n.includes("đen") || n.includes("black")) return "#000000";
  if (n.includes("trắng") || n.includes("white") || n.includes("trong"))
    return "#ffffff";
  if (n.includes("xám") || n.includes("ghi") || n.includes("gray"))
    return "#808080";
  if (n.includes("bạc") || n.includes("silver")) return "#c0c0c0";

  // Red family
  if (n.includes("đỏ đô") || n.includes("đỏ rượu")) return "#8b0000";
  if (n.includes("đỏ cam")) return "#ff4500";
  if (n.includes("đỏ")) return "#ff0000";

  // Pink family
  if (n.includes("hồng pastel")) return "#ffd1dc";
  if (n.includes("hồng")) return "#ff69b4";

  // Orange / Yellow
  if (n.includes("cam đất")) return "#cc5500";
  if (n.includes("cam")) return "#ff8c00";
  if (n.includes("vàng chanh")) return "#fff700";
  if (n.includes("vàng")) return "#ffd700";

  // Green family
  if (n.includes("xanh lá") || n.includes("xanh lục") || n.includes("green"))
    return "#00a86b";
  if (n.includes("xanh bộ đội")) return "#4b5320";
  if (n.includes("olive") || n.includes("oliu")) return "#808000";

  if (n.includes("xanh dương") || n.includes("blue")) return "#005bbb";
  if (n.includes("xanh da trời") || n.includes("sky")) return "#87ceeb";
  if (n.includes("xanh navy") || n.includes("navy")) return "#001f3f";
  if (n.includes("xanh biển")) return "#1e90ff";
  if (n.includes("xanh bạc hà") || n.includes("mint")) return "#98ff98";
  if (n.includes("xanh rêu")) return "#3a5f0b";
  if (n.includes("xanh than")) return "#003366";
  if (n.includes("xanh")) return "#0074d9";

  // Brown / Beige
  if (n.includes("nâu đất")) return "#7b3f00";
  if (n.includes("nâu nhạt")) return "#c4a484";
  if (n.includes("nâu")) return "#8b4513";
  if (n.includes("be") || n.includes("kem") || n.includes("cream"))
    return "#f5f5dc";
  if (n.includes("da") || n.includes("skin")) return "#eed9c4";

  // Purple
  if (n.includes("tím pastel")) return "#d8bfd8";
  if (n.includes("tím") || n.includes("purple")) return "#800080";

  // Misc
  if (n.includes("vintage")) return "#c8c2ae";
  if (n.includes("than")) return "#2f4f4f";

  return "#cccccc";
};

export const resolveColorHex = ({
  hex,
  cssClass,
  fallbackName,
}: {
  hex?: string | null;
  cssClass?: string | null;
  fallbackName?: string | null;
}) => {
  if (hex && isHex(hex)) {
    return normalizeHex(hex.trim());
  }

  if (cssClass) {
    if (isHex(cssClass)) {
      return normalizeHex(cssClass.trim());
    }
    const mapped = COLOR_CLASS_MAP.get(cssClass);
    if (mapped) return mapped;
  }

  return guessHexFromName(fallbackName);
};

export const isLightColorHex = (hex?: string | null) => {
  if (!hex || !isHex(hex)) return false;
  const normalized = normalizeHex(hex.trim()).slice(1);
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);

  // perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200;
};

