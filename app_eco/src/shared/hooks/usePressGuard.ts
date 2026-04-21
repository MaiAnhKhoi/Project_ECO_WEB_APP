import { useCallback, useRef } from "react";

export function usePressGuard(cooldownMs: number = 450) {
  const lastAtRef = useRef(0);

  return useCallback(
    (fn: () => void) => {
      const now = Date.now();
      if (now - lastAtRef.current < cooldownMs) return;
      lastAtRef.current = now;
      fn();
    },
    [cooldownMs]
  );
}

