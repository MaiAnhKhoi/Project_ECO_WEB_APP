import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Contact from "@/components/otherPages/Contact";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Liên hệ");
export default function ContactusPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Liên hệ" pageTitle="Liên hệ" />
      <Contact />
      <Footer />
    </>
  );
}
