import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeStyle } from "../api/aiApi";
import { AI_HISTORY_STYLE_KEY } from "../queryKeys";

// -----------------------------------------------------------------
// useStyleAnalysis — mutation một lần mỗi lần upload ảnh
// -----------------------------------------------------------------
export function useStyleAnalysis(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: File) => analyzeStyle(image, userId),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_HISTORY_STYLE_KEY });
    },
  });
}
