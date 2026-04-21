import { useState } from "react";
import authApi from "@/services/authApi";
import { Offcanvas } from "bootstrap";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate
    if (formData.password !== formData.passwordConfirm) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(formData);
      
      if (response.data.success) {
        setSuccessMsg(response.data.message || "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
        
        
        const registeredEmail = formData.email;
        localStorage.setItem("tempVerifyEmail", registeredEmail);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          passwordConfirm: "",
        });

        // Mở modal xác thực email sau 2 giây
        setTimeout(() => {
          try {
            const registerEl = document.getElementById("register");
            const verifyEl = document.getElementById("verifyEmail");
            
            if (registerEl && verifyEl) {
              const bsRegister = Offcanvas.getInstance(registerEl);
              if (bsRegister) {
                bsRegister.hide();
              }

              const bsVerify = new Offcanvas(verifyEl);
              bsVerify.show();
            }
          } catch (error) {
            console.error("Error switching modals:", error);
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      
      let errorMessage = "Có lỗi xảy ra, vui lòng thử lại!";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!";
      } else if (err.response?.status === 409) {
        errorMessage = "Email này đã được đăng ký!";
      } else if (!err.response) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối!";
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style-1 popup-register"
      id="register"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header popup-header">
          <span className="title">Tạo Tài Khoản</span>
          <button
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body popup-inner">
          <form onSubmit={handleRegister} className="form-login">
            <div className="">
              <fieldset className="text mb_12">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên*"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="email mb_12">
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="text mb_12">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại (tùy chọn)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="password mb_12">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu*"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="password">
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Xác nhận mật khẩu*"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                />
              </fieldset>
            </div>

            {errorMsg && (
              <p className="text-danger text-sm mt_12">{errorMsg}</p>
            )}

            {successMsg && (
              <p className="text-success text-sm mt_12" style={{ color: "#12B347" }}>{successMsg}</p>
            )}

            <div className="bot">
              <p className="text text-sm text-main-2">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
              </p>
              <div className="button-wrap">
                <button
                  className="subscribe-button tf-btn animate-btn bg-dark-2 w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang gửi email..." : "Đăng ký"}
                </button>
                <button
                  type="button"
                  data-bs-target="#login"
                  data-bs-toggle="offcanvas"
                  className="tf-btn btn-out-line-dark2 w-100"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
