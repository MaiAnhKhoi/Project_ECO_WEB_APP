"use client";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { blogMenuItems } from "@/data/menu";
import { useLocation } from "react-router-dom";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import type { MenuLink, DemoItem } from "@/types";
import { getContactEmail, getContactPhone, getContactAddress } from "@/config/shop";

export default function MobileMenu() {
  const { pathname } = useLocation();
  
  // Đảm bảo mobile menu chỉ hoạt động trên mobile (< 768px)
  useEffect(() => {
    const handleResize = () => {
      const mobileMenuEl = document.getElementById("mobileMenu");
      if (!mobileMenuEl) return;
      
      // Nếu màn hình >= 768px và menu đang mở thì đóng lại
      if (window.innerWidth >= 768) {
        const bsOffcanvas = (window as any).bootstrap?.Offcanvas;
        if (bsOffcanvas) {
          const offcanvasInstance = bsOffcanvas.getInstance(mobileMenuEl);
          if (offcanvasInstance && offcanvasInstance._isShown) {
            offcanvasInstance.hide();
          }
        }
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Kiểm tra ngay khi component mount
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const isHomeActive = pathname === "/";
  const isProductActive =
    pathname.startsWith("/shop") || pathname.startsWith("/product");
  const isBlogActive =
    pathname.startsWith("/blog") ||
    pathname.startsWith("/blog-single") ||
    pathname.startsWith("/blog-category");
  const isAboutActive = pathname.startsWith("/about-us");
  const isContactActive = pathname.startsWith("/contact-us");

  const isMenuActive = (link: MenuLink | DemoItem) => {
    if (!link.href) return false;
    return (
      pathname === link.href || pathname.startsWith(link.href + "/")
    );
  };

  const isBlogParentActive = (menu: (MenuLink | DemoItem)[]) => {
    return isBlogActive || menu.some((elm) => isMenuActive(elm));
  };
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <button
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <div className="mb-content-top">
            <form className="form-search">
              <input
                type="text"
                placeholder="Search product"
                className=""
                name="text"
                tabIndex={0}
                defaultValue=""
                aria-required="true"
                required
              />
              <button type="submit">
                <i className="icon icon-search" />
              </button>
            </form>
            <ul className="nav-ul-mb" id="wrapper-menu-navigation">
              {/* TRANG CHỦ */}
              <li className="nav-mb-item">
                <Link
                  to="/"
                  className={`mb-menu-link ${isHomeActive ? "menuActive" : ""}`}
                >
                  <span>Trang chủ</span>
                </Link>
              </li>

              {/* SẢN PHẨM */}
              <li className="nav-mb-item">
                <Link
                  to="/shop-default"
                  className={`mb-menu-link ${isProductActive ? "menuActive" : ""}`}
                >
                  <span>Sản phẩm</span>
                </Link>
              </li>

              {/* BLOG */}
              <li className="nav-mb-item">
                <a
                  href="#dropdown-menu-blog"
                  className={`collapsed mb-menu-link ${
                    isBlogParentActive(blogMenuItems) ? "menuActive" : ""
                  }`}
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="dropdown-menu-blog"
                >
                  <span>Blog</span>
                  <span className="btn-open-sub" />
                </a>
                <div id="dropdown-menu-blog" className="collapse">
                  <ul className="sub-nav-menu">
                    {blogMenuItems.map((link, i) => (
                      <li key={i}>
                        <Link
                          to={link.href}
                          className={`sub-nav-link ${
                            isMenuActive(link) ? "menuActive" : ""
                          }`}
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* GIỚI THIỆU */}
              <li className="nav-mb-item">
                <Link
                  to="/about-us"
                  className={`mb-menu-link ${isAboutActive ? "menuActive" : ""}`}
                >
                  <span>Giới thiệu</span>
                </Link>
              </li>

              {/* LIÊN HỆ */}
              <li className="nav-mb-item">
                <Link
                  to="/contact-us"
                  className={`mb-menu-link ${isContactActive ? "menuActive" : ""}`}
                >
                  <span>Liên hệ</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-other-content">
            <div className="group-icon">
              <Link to={`/wish-list`} className="site-nav-icon">
                <i className="icon icon-heart" />
                Yêu thích
              </Link>
              <a
                href="#login"
                data-bs-toggle="offcanvas"
                className="site-nav-icon"
              >
                <i className="icon icon-user" />
                Đăng nhập
              </a>
            </div>
            <div className="mb-notice">
              <Link to={`/contact-us`} className="text-need">
                Cần hỗ trợ?
              </Link>
            </div>
            <div className="mb-contact">
              <p>Địa chỉ: {getContactAddress()}</p>
            </div>
            <ul className="mb-info">
              <li>
                Email: <b className="fw-medium">{getContactEmail()}</b>
              </li>
              <li>
                Điện thoại: <b className="fw-medium">{getContactPhone()}</b>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-bottom">
          <div className="bottom-bar-language">
            <div className="tf-currencies">
              <CurrencySelect />
            </div>
            <div className="tf-languages">
              <LanguageSelect parentClassName="image-select center style-default type-languages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
