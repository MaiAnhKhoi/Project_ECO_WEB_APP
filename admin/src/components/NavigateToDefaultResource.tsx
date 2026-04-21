import { Navigate } from "react-router-dom";
import { usePermissions } from "@refinedev/core";

export const NavigateToDefaultResource = () => {
  const { data: permissions, isLoading } = usePermissions({});

  if (isLoading) return null;

  console.log(permissions.role)
  const role = permissions?.role;
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const roleDefaultRoute: Record<string, string> = {
    ADMIN: "/statistics",
    PRODUCT_MANAGER: "/products",
    MARKETING_STAFF: "/coupons",
  };

  const defaultPath = roleDefaultRoute[role] ?? "/";

  return <Navigate to={defaultPath} replace />;
};
