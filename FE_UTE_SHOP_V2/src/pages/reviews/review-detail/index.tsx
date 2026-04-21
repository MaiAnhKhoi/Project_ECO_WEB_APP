import ReviewDetail from "@/components/reviews/ReviewDetail";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Chi tiết đánh giá");

export default function ReviewDetailPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Chi tiết đánh giá" pageTitle="Chi tiết đánh giá" />
      <ReviewDetail />
      <Footer />
    </>
  );
}

