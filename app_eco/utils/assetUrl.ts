import { getApiBaseUrl, getPublicSiteOrigin } from "@/config/api";

export function resolveAssetUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  const apiBase = getApiBaseUrl();
  const origin = apiBase.replace(/\/api\/?$/i, "");
  if (raw.startsWith("/")) return `${origin}${raw}`;
  return `${origin}/${raw}`;
}

/**
 * URL ảnh sản phẩm gửi API thử đồ (Replicate cần URL tải được từ internet).
 * Đường dẫn tương đối ghép với `getPublicSiteOrigin()` — nên set `EXPO_PUBLIC_PUBLIC_SITE_URL` khi API chỉ chạy LAN.
 */
export function resolveGarmentImageForTryOn(input: string | null | undefined): string {
  const raw = String(input ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const origin = getPublicSiteOrigin();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}

