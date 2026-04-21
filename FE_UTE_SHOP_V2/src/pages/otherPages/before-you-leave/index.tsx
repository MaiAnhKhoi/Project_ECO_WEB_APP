import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/components/homes/homes/Banner";
import Brands from "@/components/common/BrandsSecondary";
import Categories from "@/components/homes/homes/Categories";
import Collections from "@/components/homes/homes/Collections";
import Features from "@/components/homes/homes/Features";
import Hero from "@/components/homes/homes/Hero";
import Products from "@/components/homes/homes/Products";
import ProductsSecondary from "@/components/homes/homes/ProductsSecondary";
import Shopgram from "@/components/homes/homes/Shopgram";
import Testimonials from "@/components/homes/homes/Testimonials";
import BeforeLeave from "@/components/modals/BeforeLeave";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Trước khi rời đi");

export default function BeforeYouLeavePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Hero />
      <Collections />
      <Products />
      <Banner />
      <Categories />
      <ProductsSecondary />
      <Testimonials />
      <Brands />
      <Shopgram />
      <Features />
      <Footer />
      <BeforeLeave />
    </>
  );
}
