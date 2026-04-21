/** Chữ cái đầu của từ đầu tiên (vd. họ tên). */
export function nameInitial(name: string | null | undefined): string {
  const t = (name ?? "").trim();
  if (!t) return "?";
  const word = t.split(/\s+/)[0] ?? t;
  const ch = word[0] ?? t[0];
  return ch ? ch.toUpperCase() : "?";
}
