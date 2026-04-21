"use client";

import { FormEvent, useEffect, useState } from "react";
import shopSettingApi, {
  ShopSettingResponse,
} from "@/services/shopsettingApi";
import contactMessageApi from "@/services/contactMessageApi";

export default function Contact() {
  const [info, setInfo] = useState<ShopSettingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    shopSettingApi
      .getShopSettings()
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => {
        console.error("Failed to load contact info", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="s-contact flat-spacing-13">
        <div className="container py-5">Đang tải thông tin liên hệ...</div>
      </section>
    );
  }

  if (!info) {
    return (
      <section className="s-contact flat-spacing-13">
        <div className="container py-5 text-danger">
          Không thể tải thông tin liên hệ.
        </div>
      </section>
    );
  }

  const mapSrc =
    info.mapIframe ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27294.62418958524!2d151.25730233429948!3d-33.82005608618041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ab8bc95a137f%3A0x358f04a7f6f5f6a6!2sGrotto%20Point%20Lighthouse!5e0!3m2!1sen!2s!4v1733976867160!5m2!1sen!2s";

  return (
    <section className="s-contact flat-spacing-13">
      <div className="container">
        <div className="row">
          {/* Map */}
          <div className="col-lg-12">
            <div className="wg-map">
              <iframe
                src={mapSrc}
                className="map"
                style={{ border: "none" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Left content */}
          <div className="col-lg-6">
            <div className="content-left">
              <div className="title fw-medium display-md-2">
                Liên hệ với chúng tôi
              </div>
              <p className="sub-title text-main">
                Có câu hỏi? Vui lòng liên hệ với chúng tôi qua các kênh hỗ trợ
                khách hàng
                <br />
                bên dưới.
              </p>
              <ul className="contact-list">
                <li>
                  <p>
                    Địa chỉ:{" "}
                    <a
                      className="link"
                      href={`https://www.google.com/maps?q=${encodeURIComponent(
                        info.address
                      )}`}
                      target="_blank"
                    >
                      {info.address}
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    Số điện thoại:{" "}
                    <a
                      className="link"
                      href={`tel:${(info.phone || "").replace(/\s/g, "")}`}
                    >
                      {info.phone}
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    Email:{" "}
                    <a className="link" href={`mailto:${info.email}`}>
                      {info.email}
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    Giờ mở cửa:{" "}
                    <span className="text-main">
                      {" "}
                      {info.openingHours || "8:00 - 19:00, Thứ 2 - Thứ 7"}{" "}
                    </span>
                  </p>
                </li>
              </ul>

              {/* Social */}
              <ul className="tf-social-icon style-large">
                <li>
                  <a
                    href={info.facebookUrl || "https://www.facebook.com/"}
                    className="social-item social-facebook"
                  >
                    <i className="icon icon-fb" />
                  </a>
                </li>
                <li>
                  <a
                    href={info.instagramUrl || "https://www.instagram.com/"}
                    className="social-item social-instagram"
                  >
                    <i className="icon icon-instagram" />
                  </a>
                </li>
                <li>
                  <a
                    href={info.xUrl || "https://x.com/"}
                    className="social-item social-x"
                  >
                    <i className="icon icon-x" />
                  </a>
                </li>
                <li>
                  <a
                    href={info.snapchatUrl || "https://www.snapchat.com/"}
                    className="social-item social-snapchat"
                  >
                    <i className="icon icon-snapchat" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right content – form giữ nguyên */}
          <div className="col-lg-6">
            <div className="content-right">
              <div className="title fw-medium display-md-2">Liên hệ</div>
              <p className="sub-title text-main">
                Vui lòng gửi&nbsp;tất cả các câu hỏi chung&nbsp;trong biểu mẫu
                liên hệ bên dưới và chúng tôi mong muốn được nghe từ bạn sớm.
              </p>
              <div className="form-contact-wrap">
                <form
                  className="form-default"
                  onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    setSubmitting(true);
                    setSuccessMessage(null);
                    setErrorMessage(null);
                    try {
                      await contactMessageApi.submit({
                        name: formState.name,
                        email: formState.email,
                        message: formState.message,
                      });
                      setSuccessMessage("Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.");
                      setFormState({ name: "", email: "", message: "" });
                    } catch (error) {
                      console.error(error);
                      setErrorMessage("Gửi thất bại, vui lòng thử lại.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <div className="wrap">
                    <div className="cols">
                      <fieldset>
                        <label htmlFor="username">Tên của bạn*</label>
                        <input
                          id="username"
                          type="text"
                          name="username"
                          required
                          value={formState.name}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                      </fieldset>
                      <fieldset>
                        <label htmlFor="email">Email của bạn*</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, email: e.target.value }))
                          }
                        />
                      </fieldset>
                    </div>
                    <div className="cols">
                      <fieldset className="textarea">
                        <label htmlFor="mess">Tin nhắn</label>
                        <textarea
                          id="mess"
                          required
                          value={formState.message}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, message: e.target.value }))
                          }
                        />
                      </fieldset>
                    </div>
                    {successMessage && (
                      <p className="text-success mb-2">{successMessage}</p>
                    )}
                    {errorMessage && <p className="text-danger mb-2">{errorMessage}</p>}
                    <div className="button-submit">
                      <button className="tf-btn animate-btn" type="submit" disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Gửi"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
