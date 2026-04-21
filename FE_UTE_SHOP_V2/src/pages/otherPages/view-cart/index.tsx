import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import RelatedProducts from "@/components/otherPages/RelatedProducts";
import ShopCart from "@/components/otherPages/ShopCart";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import { formatPrice } from "@/utils/formatPrice";

const metadata = createPageMetadata("Giỏ hàng");
export default function ViewCartPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <>
        <Breadcumb pageName="Giỏ hàng" pageTitle="Giỏ hàng" />

        {/* /Title Page */}
        <div className="flat-spacing-24">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-4 col-sm-8">
                <div className="tf-cart-head text-center">
                  {/* <p className="text-xl-3 title text-dark-4">
                    Mua thêm <span className="fw-medium">{formatPrice(2400000)}</span> để được
                    <span className="fw-medium"> Miễn phí vận chuyển</span>
                  </p> */}
                  {/* <div className="progress-sold tf-progress-ship">
                    <div
                      className="value"
                      style={{ width: "60%" }}
                      data-progress={60}
                    >
                      <i className="icon icon-car" />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <ShopCart />
      {/* <RelatedProducts /> */}
      <Footer />
    </>
  );
}
