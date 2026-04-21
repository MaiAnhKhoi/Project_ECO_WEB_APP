import { Link } from "react-router-dom";
import type { BreadcumbProps } from "@/types";

export default function Breadcumb({ product }: BreadcumbProps) {
  return (
    <>
      <div className="breadcrumb-sec">
        <div className="container">
          <div className="breadcrumb-wrap">
            <div className="breadcrumb-list">
              <Link to={`/`} className="breadcrumb-item">
                Trang chủ
              </Link>
              <div className="breadcrumb-item dot">
                <span />
              </div>
              <div className="breadcrumb-item current">
                {" "}
                {product?.title ? product?.title : "Linen Blend Pants"}
              </div>
            </div>
            <div className="breadcrumb-prev-next">
              <a href="#" className="breadcrumb-prev">
                <i className="icon icon-arr-left" />
              </a>
              <Link to={`/shop-default`} className="breadcrumb-back">
                <i className="icon icon-shop" />
              </Link>
              <a href="#" className="breadcrumb-next">
                <i className="icon icon-arr-right2" />
              </a>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
