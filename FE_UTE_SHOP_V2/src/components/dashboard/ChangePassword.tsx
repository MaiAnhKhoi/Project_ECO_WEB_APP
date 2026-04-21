"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import authApi from "@/services/authApi";
import Sidebar from "./Sidebar";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
}

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  if (!oldPassword || !newPassword || !confirmPassword) {
    setErrorMsg("Vui lòng điền đầy đủ các trường.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setErrorMsg("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    return;
  }

  setLoading(true);
  try {
    await authApi.changePassword({
      currentPassword: oldPassword,
      newPassword: newPassword,
      newPasswordConfirm: confirmPassword, // ✅ đúng trường backend yêu cầu
    });
    setSuccessMsg("Đổi mật khẩu thành công!");
    setTimeout(() => navigate("/account-page"), 1000);
  } catch (err: any) {
    setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
      <div className="card p-4">
        <h4 className="mb-2">Bạn chưa đăng nhập</h4>
        <p className="mb-3">Vui lòng đăng nhập để đổi mật khẩu.</p>
        <button
          className="tf-btn bg-dark-2 text-white"
          data-bs-toggle="offcanvas"
          data-bs-target="#login"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        {/* Nút mở sidebar trên mobile */}
        <div className="btn-sidebar-mb d-lg-none mb-3">
          <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
            <i className="icon icon-sidebar" />
          </button>
        </div>

        <div className="main-content-account d-flex">
          {/* Sidebar desktop */}
          <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
            <ul className="my-account-nav">
              <Sidebar />
            </ul>
          </div>

          {/* Nội dung chính */}
          <div className="content-account flex-grow-1">
            {/* Header thông tin người dùng */}
            {/* <div className="card p-4 mb-4">
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
            </div> */}

            {/* Box đổi mật khẩu (thay thế 2 box thông tin cá nhân và tài khoản) */}
            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <div className="card p-4 h-100">
                  <h5 className="mb-3">Đổi mật khẩu</h5>
                  <form onSubmit={handleSubmit}>
                    <fieldset className="mb-3">
                      <label className="text-muted text-sm d-block mb-1">Mật khẩu cũ</label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="form-control"
                      />
                    </fieldset>

                    <fieldset className="mb-3">
                      <label className="text-muted text-sm d-block mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="form-control"
                      />
                    </fieldset>

                    <fieldset className="mb-3">
                      <label className="text-muted text-sm d-block mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-control"
                      />
                    </fieldset>

                    {errorMsg && <p className="text-danger text-sm mb-2">{errorMsg}</p>}
                    {successMsg && <p className="text-success text-sm mb-2">{successMsg}</p>}

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="tf-btn bg-dark-2 text-white flex-grow-1"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                      </button>
                      <button
                        type="button"
                        className="tf-btn btn-out-line-dark2 flex-grow-1"
                        onClick={() => navigate("/account-page")}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Nếu muốn, có thể để box khác trống bên phải để layout giống Account */}
            <div className="row g-3 mt-3">
              <div className="col-12 col-lg-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
