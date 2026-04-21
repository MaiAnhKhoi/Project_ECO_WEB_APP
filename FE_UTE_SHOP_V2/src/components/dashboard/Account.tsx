"use client";

import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import authApi, { User } from "@/services/authApi";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.getProfile();
        setUser(res.data.data); // res.data là phần "data" trong response
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="card p-4">
            <h4 className="mb-2">Đang tải thông tin tài khoản...</h4>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="card p-4">
            <h4 className="mb-2">Bạn chưa đăng nhập</h4>
            <p className="mb-3">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
            <button
              className="tf-btn bg-dark-2 text-white"
              data-bs-toggle="offcanvas"
              data-bs-target="#login"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        <div className="btn-sidebar-mb d-lg-none mb-3">
          <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
            <i className="icon icon-sidebar" />
          </button>
        </div>

        <div className="main-content-account d-flex">
          <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
            <ul className="my-account-nav">
              <Sidebar />
            </ul>
          </div>

          <div className="content-account flex-grow-1">
            {/* Header thông tin người dùng */}
            <div className="card p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <h3 className="mb-1">Xin chào, {user.name}</h3>
                  <p className="text-sm text-muted mb-0">
                    Mã khách hàng: <strong>#{user.id}</strong>
                  </p>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="badge bg-success mb-1">
                    Trạng thái: {user.status === "ACTIVE" ? "Hoạt động" : user.status}
                  </span>
                  <span className="text-xs text-muted">
                    Lần đăng nhập gần nhất: {formatDate(user.lastLoginAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="row g-3">
              {/* Thông tin cá nhân */}
              <div className="col-12 col-lg-6">
                <div className="card p-4 h-100">
                  <h5 className="mb-3">Thông tin cá nhân</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className="text-muted text-sm d-block">Họ và tên</span>
                      <span className="fw-semibold">{user.name}</span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted text-sm d-block">Email</span>
                      <span className="fw-semibold">{user.email}</span>
                      <span
                        className={`badge ms-2 text-xs ${
                          user.emailVerified ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted text-sm d-block">Số điện thoại</span>
                      <span className="fw-semibold">{user.phone || "Chưa cập nhật"}</span>
                      {user.phone && (
                        <span
                          className={`badge ms-2 text-xs ${
                            user.phoneVerified ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {user.phoneVerified ? "Đã xác minh" : "Chưa xác minh"}
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Thông tin tài khoản / bảo mật */}
              <div className="col-12 col-lg-6">
                <div className="card p-4 h-100">
                  <h5 className="mb-3">Thông tin tài khoản</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className="text-muted text-sm d-block">Vai trò</span>
                      <span className="fw-semibold">
                        {user.roles?.map((r) => r.name).join(", ") || "Customer"}
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted text-sm d-block">Xác thực 2 bước</span>
                      <span className="fw-semibold">
                        {user.twoFactorEnabled ? "Đang bật bảo mật 2 lớp" : "Chưa bật"}
                      </span>
                    </li>
                    <li className="mb-3">
                      <span className="text-muted text-sm d-block">Trạng thái tài khoản</span>
                      <span className="fw-semibold">
                        {user.status === "ACTIVE" ? "Đang hoạt động" : user.status}
                      </span>
                    </li>
                  </ul>

                  <div className="d-grid gap-2 mt-3">
                    <Link
                      to="/account-settings"
                      className="tf-btn btn-out-line-dark2 w-100 text-center"
                    >
                      Cập nhật thông tin
                    </Link>
                    <Link
                      to="/account-changepass"
                      className="tf-btn btn-out-line-dark2 w-100 text-center"
                    >
                      Đổi mật khẩu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
