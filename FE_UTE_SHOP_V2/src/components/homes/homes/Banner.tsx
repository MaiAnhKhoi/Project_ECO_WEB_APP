;
import { Link } from "react-router-dom";
import CountdownTimer from "@/components/common/Countdown";

export default function Banner() {
  return (
    <section>
      <div className="container">
        <div className="s-banner-countdown banner-cd-fashion">
          <div className="image">
            <img
              src="/images/banner/fashion-1.jpg"
              alt=""
              className="lazyload"
              width={1440}
              height={488}
            />
          </div>
          <div className="banner-content text-center">
            <div className="box-title wow fadeInUp">
              <p className="season text-md fw-medium">SUMMER SALE</p>
              <h2 className="fw-medium">50% OFF</h2>
              <p className="sub text-md fw-medium">WITH PROMOTE CODE: 12D34E</p>
            </div>
            <div className="box-countdown d-flex justify-content-center wow fadeInUp">
              <div className="wg-countdown-2">
                <span className="js-countdown">
                  <CountdownTimer
                    targetDate={new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()}
                    style={2}
                  />
                </span>
              </div>
            </div>
            <div className="box-btn wow fadeInUp">
              <Link
                to={`/shop-default`}
                className="tf-btn btn-white hover-primary"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
