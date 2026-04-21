import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * URL gốc API (cùng prefix `/api` với FE).
 *
 * - Ưu tiên: `EXPO_PUBLIC_API_URL` trong `.env`
 * - Android emulator: mặc định `http://10.0.2.2:8080/api` (trỏ về máy host)
 * - iOS simulator: `http://localhost:8080/api`
 * - Máy thật: đặt IP LAN, ví dụ `http://192.168.1.5:8080/api`
 *
 * Android chặn HTTP cleartext — đã bật `usesCleartextTraffic` trong `app.json`.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");

  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  if (extra?.apiUrl) return extra.apiUrl.replace(/\/$/, "");

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }
  return "http://localhost:8080/api";
}

/**
 * Origin công khai để ghép URL ảnh tương đối (vd. `/uploads/...`) gửi cho dịch vụ bên thứ ba (thử đồ ảo).
 * Khi API chỉ chạy LAN (`10.0.2.2`), Replicate không tải được ảnh SP — đặt `EXPO_PUBLIC_PUBLIC_SITE_URL`
 * trỏ tới domain/CDN thật (vd. https://uteshop.vn hoặc Cloudinary).
 */
export function getPublicSiteOrigin(): string {
  const fromEnv =
    process.env.EXPO_PUBLIC_PUBLIC_SITE_URL?.trim() ||
    process.env.EXPO_PUBLIC_WEB_ORIGIN?.trim();
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");
  return getApiBaseUrl().replace(/\/api\/?$/i, "");
}
