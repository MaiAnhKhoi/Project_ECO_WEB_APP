"use client";
import { Link, useLocation } from "react-router-dom";
import { blogMenuItems } from "@/data/menu";
import type { MenuLink, DemoItem } from "@/types";

export default function Nav() {
  const { pathname } = useLocation();

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
    <>
      {/* CSS RÚT GỌN DROPDOWN */}
      <style>{`
        .sub-menu-style-3 {
          min-width: 200px !important;
          width: auto !important;
          padding: 10px 14px !important;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          background: #fff;
        }

        .sub-menu-style-3 .menu-list li {
          white-space: nowrap;
        }

        /* Fix bị lệch so với nút Blog */
        .menu-item.position-relative .sub-menu-style-3 {
          left: 0 !important;
          right: auto !important;
          transform: translateY(10px);
        }

        /* Hover đẹp hơn */
        .sub-menu-style-3 .menu-link-text {
          display: block;
          padding: 6px 8px;
          border-radius: 6px;
          transition: 0.2s ease;
        }

        .sub-menu-style-3 .menu-link-text:hover {
          background-color: #f3f4f6;
        }
      `}</style>

      {/* TRANG CHỦ */}
      <li className="menu-item">
        <Link
          to="/"
          className={`item-link ${isHomeActive ? "menuActive" : ""}`}
        >
          Trang chủ
        </Link>
      </li>

      {/* SẢN PHẨM */}
      <li className="menu-item">
        <Link
          to="/shop-default"
          className={`item-link ${isProductActive ? "menuActive" : ""}`}
        >
          Sản phẩm
        </Link>
      </li>

      {/* BLOG */}
      <li className="menu-item position-relative">
        <a
          href="#"
          className={`item-link ${
            isBlogParentActive(blogMenuItems) ? "menuActive" : ""
          }`}
        >
          Blog
          <i className="icon icon-arr-down" />
        </a>

        <div className="sub-menu sub-menu-style-3">
          <ul className="menu-list">
            {blogMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`menu-link-text link ${
                    isMenuActive(item) ? "menuActive" : ""
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>

      {/* GIỚI THIỆU */}
      <li className="menu-item">
        <Link
          to="/about-us"
          className={`item-link ${isAboutActive ? "menuActive" : ""}`}
        >
          Giới thiệu
        </Link>
      </li>

      {/* LIÊN HỆ */}
      <li className="menu-item">
        <Link
          to="/contact-us"
          className={`item-link ${isContactActive ? "menuActive" : ""}`}
        >
          Liên hệ
        </Link>
      </li>
    </>
  );
}
