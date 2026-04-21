import { useState, useEffect } from "react";
import authApi from "@/services/authApi";
import { Offcanvas } from "bootstrap";

export default function ResetPasswordConfirm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Lấy email từ localStorage khi modal mở lần đầu
    const tempEmail = localStorage.getItem("tempResetEmail");
    if (tempEmail) {
      setEmail(tempEmail);
    }

    // Lắng nghe sự kiện khi modal được mở để reload email mới
    const resetModal = document.getElementById("resetPasswordConfirm");
    
    const handleModalShown = () => {
      const latestEmail = localStorage.getItem("tempResetEmail");
      if (latestEmail) {
        setEmail(latestEmail);
        // Reset các state khác
        setCode("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setErrorMsg("");
        setSuccessMsg("");
      }
    };

    resetModal?.addEventListener("shown.bs.offcanvas", handleModalShown);

    return () => {
      resetModal?.removeEventListener("shown.bs.offcanvas", handleModalShown);
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate
    if (!code || code.length < 6) {
      setErrorMsg("Vui lòng nhập mã xác thực hợp lệ!");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.resetPassword({
        email,
        code,
        newPassword,
        newPasswordConfirm,
      });

      if (response.data.success) {
        setSuccessMsg("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.");

        // Xóa email tạm
        localStorage.removeItem("tempResetEmail");

        // Reset form
        setCode("");
        setNewPassword("");
        setNewPasswordConfirm("");

        // Đóng modal reset và mở modal login sau 2 giây
        setTimeout(() => {
          try {
            const resetConfirmEl = document.getElementById("resetPasswordConfirm");
            const loginEl = document.getElementById("login");

            if (resetConfirmEl && loginEl) {
              const bsResetConfirm = Offcanvas.getInstance(resetConfirmEl);
              if (bsResetConfirm) {
                bsResetConfirm.hide();
              }

              const bsLogin = new Offcanvas(loginEl);
              bsLogin.show();
            }
          } catch (error) {
            console.error("Error switching modals:", error);
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      const errorMessage =
        err.response?.data?.message || "Mã xác thực không đúng hoặc đã hết hạn!";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style-1 popup-reset-password-confirm"
      id="resetPasswordConfirm"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header popup-header">
          <span className="title">Đặt Lại Mật Khẩu</span>
          <button
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body popup-inner">
          <form onSubmit={handleResetPassword} className="form-login">
            <div className="">
              <p className="text text-sm text-main-2 mb_12">
                Nhập mã xác thực đã được gửi đến email{" "}
                <strong>{email || "nguyenhuypm1@gmail.com"}</strong> và mật khẩu mới của bạn.
              </p>

              <fieldset className="text mb_12">
                <input
                  type="text"
                  placeholder="Mã xác thực*"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    letterSpacing: "4px",
                    fontWeight: "bold",
                  }}
                />
              </fieldset>

              <fieldset className="password mb_12">
                <input
                  type="password"
                  placeholder="Mật khẩu mới*"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </fieldset>

              <fieldset className="password mb_12">
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới*"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
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
              <p className="text text-sm text-main-2 mb_12">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
              </p>

              <div className="button-wrap">
                <button
                  className="subscribe-button tf-btn animate-btn bg-dark-2 w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>

                <button
                  type="button"
                  data-bs-target="#resetPass"
                  data-bs-toggle="offcanvas"
                  className="tf-btn btn-out-line-dark2 w-100"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

