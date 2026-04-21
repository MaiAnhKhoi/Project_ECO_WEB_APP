import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import AccountSettings from "@/components/dashboard/AccountSettings";

const metadata = createPageMetadata("Cập nhật thông tin");

export default function AccountSettingsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Cập nhật thông tin" pageTitle="Cập nhật thông tin" />
      <AccountSettings />
      <Footer />
    </>
  );
}

