import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Faqs from "@/components/otherPages/Faqs";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Câu hỏi thường gặp");
export default function FaqPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="FAQs" pageTitle="Frequently Asked Questions" />

      <Faqs />
      <Footer />
    </>
  );
}
