import { useState } from "react";
import authApi from "@/services/authApi";
import { Offcanvas } from "bootstrap";

export default function ResetPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Vui lòng nhập email!");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });

      if (response.data.success) {
        setSuccessMsg(
          response.data.message || "Mã đặt lại mật khẩu đã được gửi đến email của bạn!"
        );

        // Lưu email tạm để dùng trong modal reset password confirm
        localStorage.setItem("tempResetEmail", email);

        // Đóng modal này và mở modal nhập mã reset sau 2 giây
        setTimeout(() => {
          try {
            const resetPassEl = document.getElementById("resetPass");
            const resetConfirmEl = document.getElementById("resetPasswordConfirm");

            if (resetPassEl && resetConfirmEl) {
              const bsResetPass = Offcanvas.getInstance(resetPassEl);
              if (bsResetPass) {
                bsResetPass.hide();
              }

              const bsResetConfirm = new Offcanvas(resetConfirmEl);
              bsResetConfirm.show();
            }
          } catch (error) {
            console.error("Error switching modals:", error);
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("Lỗi quên mật khẩu:", err);
      const errorMessage =
        err.response?.data?.message || "Email không tồn tại trong hệ thống!";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style-1 popup-reset-pass"
      id="resetPass"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header popup-header">
          <span className="title">Quên Mật Khẩu</span>
          <button
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body popup-inner">
          <form onSubmit={handleForgotPassword} className="form-login">
            <div className="">
              <p className="text text-sm text-main-2 mb_12">
                Quên mật khẩu? Đừng lo! Nhập email đã đăng ký để nhận mã đặt lại mật khẩu.
              </p>

              <fieldset className="email mb_12">
                <input
                  type="email"
                  placeholder="Nhập Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>

              {errorMsg && (
                <p className="text-danger text-sm mb_12">{errorMsg}</p>
              )}

              {successMsg && (
                <p className="text-sm mb_12" style={{ color: "#12B347" }}>
                  {successMsg}
                </p>
              )}
            </div>

            <div className="bot">
              <div className="button-wrap">
                <button
                  className="subscribe-button tf-btn animate-btn bg-dark-2 w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang gửi mã..." : "Gửi mã"}
                </button>
                <button
                  type="button"
                  data-bs-target="#login"
                  data-bs-toggle="offcanvas"
                  className="tf-btn btn-out-line-dark2 w-100"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
