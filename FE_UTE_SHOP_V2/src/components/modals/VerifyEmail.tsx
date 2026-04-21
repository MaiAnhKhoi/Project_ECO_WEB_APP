import { useState, useEffect } from "react";
import authApi from "@/services/authApi";
import { Offcanvas } from "bootstrap";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Lấy email từ localStorage khi modal mở lần đầu
    const tempEmail = localStorage.getItem("tempVerifyEmail");
    if (tempEmail) {
      setEmail(tempEmail);
    }

    // Lắng nghe sự kiện khi modal được mở để reload email mới
    const verifyModal = document.getElementById("verifyEmail");
    
    const handleModalShown = () => {
      const latestEmail = localStorage.getItem("tempVerifyEmail");
      if (latestEmail) {
        setEmail(latestEmail);
        // Reset các state khác
        setCode("");
        setErrorMsg("");
        setSuccessMsg("");
      }
    };

    verifyModal?.addEventListener("shown.bs.offcanvas", handleModalShown);

    return () => {
      verifyModal?.removeEventListener("shown.bs.offcanvas", handleModalShown);
    };
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code || code.length < 6) {
      setErrorMsg("Vui lòng nhập mã xác thực hợp lệ!");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyEmail({ email, code });

      if (response.data.success) {
        setSuccessMsg("Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.");
        
        // Xóa email tạm
        localStorage.removeItem("tempVerifyEmail");

        // Đóng modal verify và mở modal login sau 2 giây
        setTimeout(() => {
          try {
            const verifyEl = document.getElementById("verifyEmail");
            const loginEl = document.getElementById("login");

            if (verifyEl && loginEl) {
              const bsVerify = Offcanvas.getInstance(verifyEl);
              if (bsVerify) {
                bsVerify.hide();
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
      console.error("Lỗi xác thực email:", err);
      const errorMessage = err.response?.data?.message || "Mã xác thực không đúng hoặc đã hết hạn!";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setErrorMsg("Không tìm thấy email!");
      return;
    }

    setResendLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await authApi.resendVerification({ email });

      if (response.data.success) {
        setSuccessMsg("Đã gửi lại mã xác thực. Vui lòng kiểm tra email!");
      }
    } catch (err: any) {
      console.error("Lỗi gửi lại mã:", err);
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi gửi lại mã!";
      setErrorMsg(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style-1 popup-verify-email"
      id="verifyEmail"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header popup-header">
          <span className="title">Xác Thực Email</span>
          <button
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body popup-inner">
          <form onSubmit={handleVerify} className="form-login">
            <div className="">
              <p className="text text-sm text-main-2 mb_12">
                Chúng tôi đã gửi mã xác thực đến email{" "}
                <strong>{email || "nguyenhuypm1@gmail.com"}</strong>. Vui lòng nhập mã để hoàn tất đăng ký.
              </p>

              <fieldset className="email mb_12">
                <input
                  type="text"
                  placeholder="Nhập mã xác thực*"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  style={{ 
                    textAlign: "center", 
                    fontSize: "24px", 
                    letterSpacing: "8px",
                    fontWeight: "bold"
                  }}
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

              <div className="text-center mb_12">
                <p className="text text-sm text-main-2">
                  Chưa nhận được mã?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className="text-main-2"
                    style={{
                      background: "none",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#167EE6",
                    }}
                  >
                    {resendLoading ? "Đang gửi..." : "Gửi lại"}
                  </button>
                </p>
              </div>
            </div>

            <div className="bot">
              <div className="button-wrap">
                <button
                  className="subscribe-button tf-btn animate-btn d-inline-flex bg-dark-2 w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang xác thực..." : "Xác thực"}
                </button>

                <button
                  type="button"
                  data-bs-dismiss="offcanvas"
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

