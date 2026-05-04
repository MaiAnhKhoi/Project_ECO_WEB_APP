/** Query keys & prefixes cho invalidate sau khi tạo mới dữ liệu AI. */
export const AI_HISTORY_STYLE_KEY = ["ai", "history", "style"] as const;
export const AI_HISTORY_OUTFITS_KEY = ["ai", "history", "outfits"] as const;
/** Mọi trang lịch sử chat: ["ai","chat","history", page] */
export const AI_CHAT_HISTORY_PREFIX = ["ai", "chat", "history"] as const;

/** Chi tiết outfit từ lịch sử (`/ai-outfit/:id`). */
export const aiOutfitHistoryDetailKey = (logId: number) =>
  ["ai", "history", "outfits", "detail", logId] as const;

/** Chi tiết phân tích phong cách từ lịch sử (`?historyId=`). */
export const aiStyleHistoryDetailKey = (id: number) =>
  ["ai", "history", "style", "detail", id] as const;
