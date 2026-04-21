import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import { getLastPath } from "@/utlis/lastPath";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const loginEl = document.getElementById("login");
    if (!loginEl) return;

    let Offcanvas: any;
    let offcanvasInstance: any;

    const handleHidden = () => {
      // 👉 luôn luôn quay lại trang trước (đã lưu)
      const backTo = getLastPath() || "/";
      navigate(backTo, { replace: true });
    };

    import("bootstrap").then((bootstrap) => {
      Offcanvas = bootstrap.Offcanvas as any;

      offcanvasInstance =
        Offcanvas.getOrCreateInstance?.(loginEl) || new Offcanvas(loginEl);

      offcanvasInstance.show();
      loginEl.addEventListener("hidden.bs.offcanvas", handleHidden);
    });

    return () => {
      loginEl.removeEventListener("hidden.bs.offcanvas", handleHidden);
    };
  }, [user, loading, navigate]);

  if (loading) return <div>Đang tải...</div>;
  if (!user) return null; // chưa login thì không render nội dung private

  return <>{children}</>;
};

export default PrivateRoute;
