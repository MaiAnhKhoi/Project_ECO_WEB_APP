import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import About from "@/components/otherPages/About";
import Features from "@/components/otherPages/Features";
import FeaturesSecondary from "@/components/otherPages/FeaturesSecondary";
import Testimonials from "@/components/otherPages/Testimonials";

import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Về chúng tôi");
export default function AboutUsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <About />
      <Features />
      <FeaturesSecondary />
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
}
