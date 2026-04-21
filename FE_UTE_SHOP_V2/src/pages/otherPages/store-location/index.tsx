import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header"
import StoreLocations from "@/components/otherPages/StoreLocations";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Vị trí cửa hàng");
export default function StoreLocationPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Store Locations" pageTitle="Store Locations" />
      <StoreLocations />
      <Footer />
    </>
  );
}
