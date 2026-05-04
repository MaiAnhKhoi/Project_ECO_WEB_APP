import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeStyle } from "@/services/aiApi";
import { useAuthStore } from "@/store/authStore";

// ============================================================
// useStyleAnalysis
//
// Mutation gửi ảnh và nhận kết quả phân tích phong cách.
// Giống pattern useOutfitGenerator — một lần mỗi lần upload.
// ============================================================

export function useStyleAnalysis() {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (imageUri: string) =>
      analyzeStyle(imageUri, token, user?.id ?? undefined),
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai", "history", "style"] });
    },
  });
}
