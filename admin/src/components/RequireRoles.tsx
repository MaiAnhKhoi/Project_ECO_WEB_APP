import { ReactNode } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Navigate } from "react-router-dom";
import { Result, Spin } from "antd";

type RequireRolesProps = {
  allowedRoles: string[]; // ví dụ: ["ADMIN", "PRODUCT_MANAGER"]
  children: ReactNode;
};

export const RequireRoles: React.FC<RequireRolesProps> = ({
  allowedRoles,
  children,
}) => {
  const { data, isLoading } = useGetIdentity<any>();


  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin />
      </div>
    );
  }

  // ❌ Chưa đăng nhập -> về login
  if (!data) {
    return <Navigate to="/login" replace />;
  }

  // 🔍 THU THẬP ROLE TỪ NHIỀU TRƯỜNG KHÁC NHAU
  let userRoles: string[] = [];

  // 1) Nếu data.roles là array object [{code, name}] hoặc string
  if (Array.isArray(data.roles)) {
    userRoles = userRoles.concat(
      data.roles.map((r: any) => {
        if (typeof r === "string") return r;
        return r.code || r.name || "";
      })
    );
  }

  // 2) Nếu data.authorities = ["ROLE_ADMIN", ...]
  if (Array.isArray(data.authorities)) {
    userRoles = userRoles.concat(
      data.authorities.map((a: any) => String(a))
    );
  }

  // 3) Nếu data.roleCodes = ["ADMIN", ...]
  if (Array.isArray(data.roleCodes)) {
    userRoles = userRoles.concat(
      data.roleCodes.map((c: any) => String(c))
    );
  }

  // Chuẩn hóa USER ROLES: bỏ null/empty, trim, upper
  userRoles = userRoles
    .filter((x) => !!x)
    .map((x) => String(x).trim().toUpperCase());

  // 👉 Tạo thêm biến thể BỎ PREFIX "ROLE_" để dễ match
  const expandedUserRoles = new Set<string>();

  for (const code of userRoles) {
    expandedUserRoles.add(code); // VD: "ROLE_ADMIN"
    if (code.startsWith("ROLE_")) {
      expandedUserRoles.add(code.substring(5)); // VD: "ADMIN"
    }
  }

  // Chuẩn hóa ALLOWED ROLES
  const normalizedAllowed = allowedRoles.map((x) =>
    String(x).trim().toUpperCase()
  );

  const hasAccess = Array.from(expandedUserRoles).some((code) =>
    normalizedAllowed.includes(code)
  );

  if (!hasAccess) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này."
      />
    );
  }

  return <>{children}</>;
};
