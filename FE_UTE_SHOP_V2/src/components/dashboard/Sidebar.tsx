"use client";

import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext"; // import context

const accountLinks = [
  { href: "/account-page", label: "Trang chính" },       
  { href: "/account-orders", label: "Đơn hàng của tôi" }, 
  { href: "/wish-list", label: "Danh sách yêu thích" },   
  { href: "/account-addresses", label: "Địa chỉ" },
  { href: "/account-reviews", label: "Đánh giá của tôi" },       
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // tránh reload
    logout();
    navigate("/"); // chuyển về trang chủ
  };

  return (
    <>
      {accountLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            to={href}
            className={`text-sm link fw-medium my-account-nav-item ${
              pathname === href ? "active" : ""
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          to="/"
          className="text-sm link fw-medium my-account-nav-item"
          onClick={handleLogout} // thêm gọi logout
        >
          Đăng xuất
        </Link>
      </li>
    </>
  );
}
