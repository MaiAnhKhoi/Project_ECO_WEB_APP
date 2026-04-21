import type { ReactNode } from "react";
import type { MetaData } from "@/types";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";

type LayoutAppProps = {
  children: ReactNode;
  meta?: MetaData;
  breadcrumb?: { pageName: string; pageTitle: string };
  showHeader?: boolean;
  showFooter?: boolean;
  footer?: ReactNode;
};

export const LayoutApp = ({
  children,
  meta,
  breadcrumb,
  showHeader = true,
  showFooter = true,
  footer,
}: LayoutAppProps) => {
  return (
    <>
      {meta ? <MetaComponent meta={meta} /> : null}
      {showHeader ? <Header /> : null}
      {breadcrumb ? (
        <Breadcumb
          pageName={breadcrumb.pageName}
          pageTitle={breadcrumb.pageTitle}
        />
      ) : null}
      {children}
      {showFooter ? footer ?? <Footer /> : null}
    </>
  );
};