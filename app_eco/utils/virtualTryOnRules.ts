import type { TryOnCategory } from "@/types/virtualTryOn";

const ACCESSORY_KEYWORDS = [
  "giày",
  "giay",
  "sandal",
  "dép",
  "dep",
  "boot",
  "sneaker",
  "loafer",
  "oxford",
  "heel",
  "pump",
  "slipper",
  "flip-flop",
  "ring",
  "nhẫn",
  "bracelet",
  "vòng",
  "necklace",
  "dây chuyền",
  "earring",
  "bông tai",
  "trang sức",
  "jewelry",
  "jewellery",
  "belt",
  "thắt lưng",
  "ví",
  "balo",
  "túi",
  "bag",
  "cap",
  "hat",
  "mũ",
  "nón",
  "kính",
  "khăn",
];

/** Giày, túi, phụ kiện… — không hỗ trợ thử đồ ảo (đồng bộ web Details.tsx). */
export function isVirtualTryOnAccessory(title: string): boolean {
  const name = (title || "").toLowerCase();
  return ACCESSORY_KEYWORDS.some((k) => name.includes(k));
}

/** Sản phẩm dạng bộ / set — cho phép chọn thử áo hoặc quần. */
export function isVirtualTryOnSetProduct(title: string): boolean {
  const name = (title || "").toLowerCase();
  return name.includes("bộ") || name.includes("set ") || name.includes("set-");
}

/** Suy luận vùng cơ thể từ tên SP (giống VirtualTryOnModal web). */
export function detectTryOnCategoryFromTitle(title: string): TryOnCategory {
  const name = (title || "").toLowerCase();
  if (
    name.includes("váy") ||
    name.includes("vay") ||
    name.includes("đầm") ||
    name.includes("dam") ||
    name.includes("dress")
  ) {
    return "dresses";
  }
  if (
    name.includes("quần") ||
    name.includes("quan") ||
    name.includes("jean") ||
    name.includes("kaki") ||
    name.includes("short")
  ) {
    return "lower_body";
  }
  if (
    name.includes("áo") ||
    name.includes("ao") ||
    name.includes("shirt") ||
    name.includes("tee") ||
    name.includes("hoodie")
  ) {
    return "upper_body";
  }
  return "upper_body";
}
