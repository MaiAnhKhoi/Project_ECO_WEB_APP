export default function Testimonials() {
  return (
    <section className="flat-spacing-15 pt-0">
      <div className="container">
        <div className="box-testimonial-quote text-center">
          <div className="list-star-default justify-content-center">
            <i className="icon-star text-green" />
            <i className="icon-star text-green" />
            <i className="icon-star text-green" />
            <i className="icon-star text-green" />
            <i className="icon-star text-green" />
          </div>
          <p className="text-xl-2 lh-xl-32">
            "Tôi đã đặt hàng ở nhiều nơi, nhưng phải nói rằng cửa hàng này mang đến
            trải nghiệm vận chuyển tốt nhất từ trước đến nay. Cảm ơn các bạn rất nhiều
            vì dịch vụ tuyệt vời!"
          </p>
          <div className="box-author">
            <div className="avt">
              <img
                alt=""
                src="/images/testimonial/tes-about.jpg"
                width={100}
                height={100}
              />
            </div>
            <p className="text-md lh-xl-26 fw-medium">Vinetant P</p>
          </div>
        </div>
      </div>
    </section>
  );
}
