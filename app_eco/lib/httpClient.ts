import { getApiBaseUrl } from "@/config/api";

/** Trích thông báo lỗi thân thiện từ body JSON của BE (message / detail / error / title). */
function extractErrorMessage(text: string, status: number, statusText: string): string {
  if (!text.trim()) return `${status} ${statusText}`;
  try {
    const j = JSON.parse(text) as Record<string, unknown>;
    const msg =
      (typeof j.message === "string" && j.message) ||
      (typeof j.detail === "string" && j.detail) ||
      (typeof j.error === "string" && j.error) ||
      (typeof j.title === "string" && j.title);
    if (msg) return msg;
  } catch {
    if (text.length < 800) return text.trim();
  }
  return `${status} ${statusText}`;
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: any; token?: string | null },
): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const method = init?.method ?? "GET";

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[http]", method, url);
  }

  const token = init?.token ?? null;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers as any),
  };

  let body: any = init?.body;
  if (init && "json" in init && init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, method, headers, body });

  if (!res.ok) {
    const text = await res.text();
    const message = extractErrorMessage(text, res.status, res.statusText);
    const err = Object.assign(new Error(message), { status: res.status });
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("[http]", method, res.status, path, message);
    }
    throw err;
  }

  /** DELETE/PUT thường trả 204 No Content */
  if (res.status === 204 || res.status === 205) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[http] OK", method, path, "(no content)");
    }
    return undefined as T;
  }

  const text = await res.text();
  if (!text.trim()) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[http] OK", method, path, "(empty body)");
    }
    return undefined as T;
  }

  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    throw new Error(`API trả về không phải JSON: ${path}`);
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[http] OK", method, path, Array.isArray(json) ? `(${json.length} mục)` : typeof json);
  }

  return json as T;
}

type ApiEnvelope = { success?: boolean; message?: string; data?: unknown };

/** POST multipart (FormData). Không set Content-Type để boundary tự sinh. */
async function postMultipart<T>(path: string, form: FormData, token?: string | null): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[http] POST (multipart)", url);
  }

  const res = await fetch(url, { method: "POST", headers, body: form });
  let json: ApiEnvelope = {};
  try {
    json = (await res.json()) as ApiEnvelope;
  } catch {
    json = {};
  }
  if (!res.ok) {
    const msg =
      typeof json.message === "string" && json.message.length > 0
        ? json.message
        : `API ${res.status}`;
    throw new Error(msg);
  }
  if (json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message.length > 0
        ? json.message
        : "Yêu cầu không thành công",
    );
  }
  return json as T;
}

export const httpClient = {
  get: <T>(
    path: string,
    init?: Omit<RequestInit, "method" | "body"> & { token?: string | null },
  ) => request<T>(path, { ...init, method: "GET" }),

  post: <T>(
    path: string,
    json?: any,
    init?: Omit<RequestInit, "method" | "body"> & { token?: string | null },
  ) => request<T>(path, { ...init, method: "POST", json }),

  postMultipart: <T>(path: string, form: FormData, token?: string | null) =>
    postMultipart<T>(path, form, token),

  put: <T>(
    path: string,
    json?: any,
    init?: Omit<RequestInit, "method" | "body"> & { token?: string | null },
  ) => request<T>(path, { ...init, method: "PUT", json }),

  patch: <T>(
    path: string,
    json?: any,
    init?: Omit<RequestInit, "method" | "body"> & { token?: string | null },
  ) => request<T>(path, { ...init, method: "PATCH", json }),

  delete: <T>(
    path: string,
    init?: Omit<RequestInit, "method" | "body"> & { token?: string | null },
  ) => request<T>(path, { ...init, method: "DELETE" }),
};
