import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Breadcumb from "@/components/products/Breadcumb";
import Features from "@/components/products/Features";
import Products from "@/components/products/Products";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Cửa hàng");
export default function ProductPageDefault() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Products cardStyleClass="grid style-1" tooltipDirection="left" />
      <Features />
      <Footer />
    </>
  );
}
