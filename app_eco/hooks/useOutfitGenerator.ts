import { useMutation } from "@tanstack/react-query";

import { generateOutfit } from "@/services/aiApi";
import type { OutfitRequest } from "@/types/ai";

// ============================================================
// useOutfitGenerator
//
// Mutation một lần mỗi prompt — giống web useOutfitGenerator.
// ============================================================

export function useOutfitGenerator() {
  return useMutation({
    mutationFn: (request: OutfitRequest) => generateOutfit(request),
    retry: 1,
  });
}
