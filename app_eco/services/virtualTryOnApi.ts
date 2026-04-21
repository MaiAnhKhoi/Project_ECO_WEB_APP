import { getApiBaseUrl } from "@/config/api";
import type { TryOnHistoryItem, TryOnRequest } from "@/types/virtualTryOn";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
};

const TEN_MIN_MS = 600_000;

function buildUrl(path: string): string {
  const base = getApiBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || res.statusText };
  }
}

function messageFromJson(json: any, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const m = json.message ?? json.error;
  return typeof m === "string" && m.length > 0 ? m : fallback;
}

async function handleEnvelope<T>(res: Response): Promise<T> {
  const json = await readJson(res);
  if (!res.ok) {
    throw new Error(messageFromJson(json, `HTTP ${res.status}`));
  }
  if (json?.success === false) {
    throw new Error(messageFromJson(json, "Yêu cầu không thành công"));
  }
  if (json?.data === undefined || json?.data === null) {
    throw new Error(messageFromJson(json, "Phản hồi không có dữ liệu."));
  }
  return json.data as T;
}

function extractUploadUrl(data: unknown): string {
  if (data && typeof data === "object" && "url" in data) {
    const u = (data as { url?: unknown }).url;
    if (typeof u === "string" && u.length > 0) return u;
  }
  throw new Error("Upload thành công nhưng không nhận được URL ảnh.");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(tid);
  }
}

export function isTryOnAbortError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const any = e as { name?: string; message?: string };
  return (
    any.name === "AbortError" ||
    any.message === "Aborted" ||
    (typeof any.message === "string" && any.message.toLowerCase().includes("abort"))
  );
}

/** Bóc lỗi kỹ thuật (Replicate 401, v.v.) thành thông báo có thể hành động được. */
export function formatVirtualTryOnError(message: string): string {
  const m = (message || "").trim();
  if (!m) return "Đã xảy ra lỗi không xác định.";
  const lower = m.toLowerCase();
  if (
    lower.includes("unauthenticated") ||
    (lower.includes("replicate") && lower.includes("401")) ||
    lower.includes("valid authentication token")
  ) {
    return "Dịch vụ AI từ chối kết nối: máy chủ cần token Replicate hợp lệ. Hãy đặt REPLICATE_API_TOKEN (hoặc replicate.api.token trong cấu hình Spring) bằng API key từ replicate.com, rồi khởi động lại backend.";
  }
  if (lower.includes("image format not supported")) {
    return "Ảnh không đúng định dạng cho máy chủ. Hãy chọn ảnh khác hoặc thử lại sau khi cập nhật ứng dụng (đã tự chuyển sang JPEG khi có thể).";
  }
  return m;
}

export const virtualTryOnApi = {
  async uploadModelImage(
    token: string,
    uri: string,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const safeName =
      fileName && !fileName.includes(":")
        ? fileName
        : `model-${Date.now()}.jpg`;
    const type =
      mimeType && mimeType.startsWith("image/")
        ? mimeType
        : "image/jpeg";

    const form = new FormData();
    form.append("file", { uri, name: safeName, type } as any);

    const res = await fetchWithTimeout(
      buildUrl("/virtual-tryon/upload-model"),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      },
      TEN_MIN_MS
    );
    const data = await handleEnvelope<unknown>(res);
    return extractUploadUrl(data);
  },

  async validateModelImage(
    token: string,
    uri: string,
    fileName: string,
    mimeType: string,
    productId: number
  ): Promise<boolean> {
    const safeName =
      fileName && !fileName.includes(":")
        ? fileName
        : `validate-${Date.now()}.jpg`;
    const type =
      mimeType && mimeType.startsWith("image/")
        ? mimeType
        : "image/jpeg";

    const form = new FormData();
    form.append("file", { uri, name: safeName, type } as any);
    form.append("productId", String(productId));

    const res = await fetchWithTimeout(
      buildUrl("/virtual-tryon/validate-model-image"),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      },
      TEN_MIN_MS
    );
    const json = await readJson(res);
    if (!res.ok) {
      throw new Error(messageFromJson(json, `HTTP ${res.status}`));
    }
    if (json?.success === false) {
      throw new Error(messageFromJson(json, "Ảnh không hợp lệ"));
    }
    if (json?.data?.valid === false) {
      throw new Error(
        messageFromJson(json, "Ảnh không phù hợp với giới tính sản phẩm.")
      );
    }
    return json?.data?.valid === true;
  },

  async tryOn(token: string, payload: TryOnRequest): Promise<TryOnHistoryItem> {
    const body: Record<string, unknown> = {
      productId: payload.productId,
      category: payload.category,
      modelImageUrl: payload.modelImageUrl,
      garmentImageUrl: payload.garmentImageUrl,
    };
    if (payload.variantId != null) {
      body.variantId = payload.variantId;
    }

    const res = await fetchWithTimeout(
      buildUrl("/virtual-tryon"),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
      TEN_MIN_MS
    );
    return handleEnvelope<TryOnHistoryItem>(res);
  },

  async getHistory(token: string, productId: number): Promise<TryOnHistoryItem[]> {
    const res = await fetch(
      buildUrl(`/virtual-tryon/history?productId=${encodeURIComponent(String(productId))}`),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await handleEnvelope<TryOnHistoryItem[] | null>(res);
    return Array.isArray(data) ? data : [];
  },
};
