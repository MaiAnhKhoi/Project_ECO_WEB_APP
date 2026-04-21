import { getApiBaseUrl } from "@/config/api";

function base64UrlEncodeUtf8(input: string): string {
  // Expo/React Native has global btoa in most runtimes; fallback included.
  const utf8 = unescape(encodeURIComponent(input));
  const b64 =
    typeof globalThis.btoa === "function"
      ? globalThis.btoa(utf8)
      : (() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const B: any = (globalThis as any).Buffer;
          if (!B?.from) {
            throw new Error("No base64 encoder available (missing btoa/Buffer)");
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          return B.from(utf8, "binary").toString("base64");
        })();
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function buildImageProxyUrl(externalUrl: string): string {
  const apiBase = getApiBaseUrl();
  const apiOrigin = apiBase.replace(/\/api\/?$/i, "");
  const u = base64UrlEncodeUtf8(externalUrl);
  return `${apiOrigin}/api/image-proxy?u=${u}`;
}

export function shouldProxyImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    return (
      host.endsWith("product.hstatic.net") ||
      host.endsWith("gstatic.com") ||
      host.endsWith("nvncdn.com")
    );
  } catch {
    return false;
  }
}

