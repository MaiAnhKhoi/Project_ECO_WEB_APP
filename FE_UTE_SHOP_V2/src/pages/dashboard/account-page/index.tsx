import Account from "@/components/dashboard/Account";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";

import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Tài khoản");
export default function AccountPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Tài khoản" pageTitle="Tài khoản" />

      <Account />
      <Footer />
    </>
  );
}
