import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Compare from "@/components/otherPages/Compare";
import { Link } from "react-router-dom";

import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("So sánh sản phẩm");
export default function ComparePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <>
        {/* Breadcrumb */}
        <div className="tf-breadcrumb">
          <div className="container">
            <ul className="breadcrumb-list">
              <li className="item-breadcrumb">
                <Link to={`/`} className="text">
                  Trang chủ
                </Link>
              </li>
              <li className="item-breadcrumb dot">
                <span />
              </li>
              <li className="item-breadcrumb">
                <span className="text">So sánh sản phẩm</span>
              </li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Title Page */}
        <section className="s-title-page flat-spacing-2 pt-0">
          <div className="container">
            <h4 className="s-title letter-0 text-center">So sánh sản phẩm</h4>
          </div>
        </section>
        {/* /Title Page */}
      </>
      <Compare />
      <Footer />
    </>
  );
}
