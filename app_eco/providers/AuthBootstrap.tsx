import React, { useEffect } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrapping = useAuthStore((s) => s.bootstrapping);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

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

