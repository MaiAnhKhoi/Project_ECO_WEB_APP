import { Link } from "react-router-dom";

export default function Breadcumb({
  fullWidth = false,
  showCollection = true,
}) {
  return (
    <>
      <section className="tf-page-title">
        <div className={fullWidth ? "container-full" : "container"}>
          <div className="box-title text-center">
            <h4 className="title">Women</h4>
            <div className="breadcrumb-list">
              <Link className="breadcrumb-item" to={`/`}>
                Trang chủ
              </Link>
              {showCollection && (
                <>
                  <div className="breadcrumb-item dot">
                    <span />
                  </div>
                  <Link
                    className="breadcrumb-item"
                    to={`/shop-default`}
                  >
                    Collections
                  </Link>
                </>
              )}
              <div className="breadcrumb-item dot">
                <span />
              </div>
              <div className="breadcrumb-item current">Women</div>
            </div>
            <p className="desc text-md text-main">
              Discover our carefully curated women's collection, where timeless
              elegance meets modern style.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
