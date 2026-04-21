// src/pages/CheckoutPage.tsx
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import Checkout from "@/components/otherPages/Checkout";
import { Link } from "react-router-dom";

import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Thanh toán");

export default function CheckoutPage() {
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
                <span className="text">Thanh toán</span>
              </li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Title Page */}
        <section className="page-title">
          <div className="container">
            <div className="box-title text-center justify-items-center">
              <h4 className="title">Thanh toán</h4>
            </div>
          </div>
        </section>
        {/* /Title Page */}
      </>
      <Checkout />
      <Footer />
    </>
  );
}
