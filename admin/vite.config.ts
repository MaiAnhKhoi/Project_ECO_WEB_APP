import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
    server: {
    port: 5174,
  },
      define: {
    global: "window", // 👈 để các lib tham chiếu 'global' dùng window
  },
});
