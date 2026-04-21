// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { TOKEN_KEY } from "../contexts/authProvider";

export default function PrivateRoute() {
  // Sử dụng TOKEN_KEY từ authProvider để nhất quán
  const accessToken = localStorage.getItem(TOKEN_KEY);

  // ❌ Nếu chưa có token -> đá ra trang login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Có token -> cho đi tiếp
  return <Outlet />;
}
