/**
 * Lấy thông báo lỗi đọc được từ lỗi fetch/httpClient (dạng `API 400: {...}` hoặc Error thường).
 */
export function getApiErrorMessage(err: unknown, fallback = "Đã có lỗi xảy ra."): string {
  if (err == null) return fallback;
  if (typeof err === "string") return err.length > 0 ? err : fallback;
  if (!(err instanceof Error)) return fallback;

  const m = err.message.trim();
  const apiMatch = /^API (\d+):\s*(.*)$/s.exec(m);
  if (apiMatch) {
    const body = apiMatch[2].trim();
    if (!body) return m;
    try {
      const j = JSON.parse(body) as Record<string, unknown>;
      if (typeof j.message === "string" && j.message.length > 0) return j.message;
      if (typeof j.detail === "string" && j.detail.length > 0) return j.detail;
      if (typeof j.error === "string" && j.error.length > 0) return j.error;
      if (typeof j.title === "string" && j.title.length > 0) return j.title;
    } catch {
      if (body.length > 0 && body.length < 800) return body;
    }
    return m;
  }

  return m.length > 0 ? m : fallback;
}
