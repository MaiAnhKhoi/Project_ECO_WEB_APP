import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/components/homes/homes/Banner";
import Brands from "@/components/common/BrandsSecondary";
import Categories from "@/components/homes/homes/Categories";
import ProductsBestSeller from "@/components/homes/homes/ProductsBestSeller";
import ProductsBestDeal from "@/components/homes/homes/ProductsBestDeal";
import ProductsBestView from "@/components/homes/homes/ProductsBestView";
import Features from "@/components/homes/homes/Features";
import Hero from "@/components/homes/homes/Hero";
import Products from "@/components/homes/homes/Products";
import ProductsSecondary from "@/components/homes/homes/ProductsSecondary";
import Shopgram from "@/components/homes/homes/Shopgram";
import Testimonials from "@/components/homes/homes/Testimonials";
// import Newsletter from "@/components/modals/Newsletter";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Trang chủ");

export default function HomePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Hero />
      <Products />
      <ProductsBestSeller />
      <ProductsBestDeal />
      <ProductsBestView  />
      {/* <Banner /> */}
      <Categories />
      <ProductsSecondary />
      <Testimonials />
      <Brands />
      {/* <Shopgram /> */}
      <Features />
      <Footer />
      {/* <Newsletter /> */}
    </>
  );
}
