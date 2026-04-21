import Address from "@/components/dashboard/Address";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";

import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Địa chỉ");
export default function AccountAddressPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Địa chỉ" pageTitle="Địa chỉ" />
      <Address />
      <Footer />
    </>
  );
}
