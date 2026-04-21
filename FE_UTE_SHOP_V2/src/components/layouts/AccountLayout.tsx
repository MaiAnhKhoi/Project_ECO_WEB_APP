import type { ReactNode } from "react";
import type { MetaData } from "@/types";
import Sidebar from "@/components/dashboard/Sidebar";
import { LayoutApp } from "@/components/layouts/LayoutApp";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

type AccountLayoutProps = {
  meta: MetaData;
  breadcrumb: { pageName: string; pageTitle: string };
  children: ReactNode;
  contentClassName?: string;
};

export default function AccountLayout({
  meta,
  breadcrumb,
  children,
  contentClassName,
}: AccountLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <LayoutApp meta={meta} breadcrumb={breadcrumb}>
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="btn-sidebar-mb d-lg-none mb-3">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  navigate(`/auth/login?next=${encodeURIComponent("/account-page")}`, {
                    replace: true,
                  });
                  return;
                }
                const el = document.getElementById("mbAccount");
                if (!el) return;
                import("bootstrap").then((bs) => {
                  const Offcanvas = (bs as any).Offcanvas;
                  const inst = Offcanvas.getOrCreateInstance?.(el) || new Offcanvas(el);
                  inst.show();
                });
              }}
            >
              <i className="icon icon-sidebar" />
            </button>
          </div>

          <div className="main-content-account d-flex">
            <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
              <ul className="my-account-nav">
                <Sidebar />
              </ul>
            </div>

            <div
              className={["content-account flex-grow-1", contentClassName]
                .filter(Boolean)
                .join(" ")}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </LayoutApp>
  );
}

