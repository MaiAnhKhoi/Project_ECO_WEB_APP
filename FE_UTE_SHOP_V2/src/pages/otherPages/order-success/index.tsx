import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import OrderSuccess from "@/components/otherPages/OrderSuccess";
import { Link } from "react-router-dom";
import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Đặt hàng thành công");

export default function OrderSuccessPage() {
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
                <span className="text">Đặt hàng thành công</span>
              </li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
      </>
      <OrderSuccess />
      <Footer />
    </>
  );
}

