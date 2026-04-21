import MyReviews from "@/components/reviews/MyReviews";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import Sidebar from "@/components/dashboard/Sidebar";

const metadata = createPageMetadata("Đánh giá của tôi");

export default function AccountReviewsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Đánh giá của tôi" pageTitle="Đánh giá của tôi" />
      
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="main-content-account d-flex">
            <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
              <ul className="my-account-nav">
                <Sidebar />
              </ul>
            </div>

            <div className="content-account flex-grow-1">
              <MyReviews />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

