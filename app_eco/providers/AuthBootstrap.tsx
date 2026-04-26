import React, { useEffect, useRef } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrapping = useAuthStore((s) => s.bootstrapping);
  /** Lấy hàm qua getState() tránh đưa vào dep array → không gọi lại mỗi render. */
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    useAuthStore.getState().bootstrap();
  }, []);

  return (
    <>
      {children}
      <LoadingSpinner
        visible={bootstrapping}
        message="Đang kiểm tra phiên đăng nhập…"
        fullscreen
      />
    </>
  );
}
