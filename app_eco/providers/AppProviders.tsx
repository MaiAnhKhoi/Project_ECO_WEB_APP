import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { AuthBootstrap } from "@/providers/AuthBootstrap";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  );
}

