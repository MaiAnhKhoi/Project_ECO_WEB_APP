import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";

import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import ChangePassword from "@/components/dashboard/ChangePassword";

const metadata = createPageMetadata("Tài khoản");
export default function AccountChangePass() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Tài khoản" pageTitle="Tài khoản" />

        <ChangePassword />
      <Footer />
    </>
  );
}
