import type { Outfit } from "../types";

const KEY = "ute_shop_ai_saved_outfits_v1";

export interface SavedOutfitEntry {
  outfit: Outfit;
  savedAt: string;
}

export function loadSavedOutfitEntries(): SavedOutfitEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is SavedOutfitEntry =>
        x != null &&
        typeof x === "object" &&
        "outfit" in x &&
        (x as SavedOutfitEntry).outfit != null
    );
  } catch {
    return [];
  }
}

export function saveOutfitEntry(outfit: Outfit): boolean {
  const list = loadSavedOutfitEntries();
  const sig = `${outfit.outfitNumber}-${outfit.name}`;
  const dup = list.some(
    (e) => `${e.outfit.outfitNumber}-${e.outfit.name}` === sig
  );
  if (dup) return false;
  const entry: SavedOutfitEntry = {
    outfit,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...list].slice(0, 24)));
  return true;
}
