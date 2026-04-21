import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userApi, { UserProfile } from "@/services/userApi";
import Sidebar from "./Sidebar";

// Random avatar từ DiceBear API
const getRandomAvatar = (seed?: string): string => {
  const avatarSeed = seed || Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
};

export default function AccountSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  // Form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getProfile();
        const userData = res.data.data;
        setUser(userData);
        
        // Set avatar preview
        if (userData.avatarUrl) {
          setAvatarPreview(userData.avatarUrl);
        } else {
          // Random avatar nếu chưa có
          setAvatarPreview(getRandomAvatar(userData.email || userData.name));
        }
        
        // Populate form
        setName(userData.name || "");
        setUsername(userData.username || "");
        setPhone(userData.phone || "");
        setGender((userData.gender as any) || "");
        setDateOfBirth(userData.dateOfBirth ? userData.dateOfBirth : "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setErrorMsg("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    // Validation
    if (!name || name.trim().length < 2) {
      setErrorMsg("Tên phải có ít nhất 2 ký tự");
      setSaving(false);
      return;
    }

    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      setErrorMsg("Username chỉ được chứa chữ cái, số và dấu gạch dưới");
      setSaving(false);
      return;
    }

    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
      setErrorMsg("Số điện thoại không hợp lệ (10-15 chữ số)");
      setSaving(false);
      return;
    }

    try {
      const updateData = {
        name: name.trim(),
        username: username.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
      };

      await userApi.updateProfile(updateData);
      
      setSuccessMsg("Cập nhật thông tin thành công!");
      
      // Refresh user data
      const res = await userApi.getProfile();
      const updatedUser = res.data.data;
      setUser(updatedUser);
      
      // Update avatar preview if needed
      if (updatedUser.avatarUrl) {
        setAvatarPreview(updatedUser.avatarUrl);
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/account-page");
      }, 2000);
    } catch (err: any) {
      console.error("Update failed:", err);
      const message = err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Định dạng ảnh không hợp lệ. Chỉ chấp nhận: JPEG, PNG, GIF, WEBP");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMsg("Kích thước ảnh quá lớn. Tối đa 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploadingAvatar(true);
      setErrorMsg("");
      const res = await userApi.uploadAvatar(file);
      setUser(res.data.data);
      setAvatarPreview(res.data.data.avatarUrl || getRandomAvatar(res.data.data.email || res.data.data.name));
      setSuccessMsg("Cập nhật ảnh đại diện thành công!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err: any) {
      console.error("Upload avatar failed:", err);
      const message = err.response?.data?.message || "Không thể upload ảnh. Vui lòng thử lại!";
      setErrorMsg(message);
      // Revert preview to original
      if (user?.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      } else {
        setAvatarPreview(getRandomAvatar(user?.email || user?.name));
      }
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRandomAvatar = async () => {
    try {
      setUploadingAvatar(true);
      setErrorMsg("");
      
      // Generate random avatar URL
      const randomSeed = Math.random().toString(36).substring(7);
      const randomAvatarUrl = getRandomAvatar(randomSeed);
      
      // Update profile with random avatar
      await userApi.updateProfile({ avatarUrl: randomAvatarUrl });
      
      // Refresh user data
      const res = await userApi.getProfile();
      const updatedUser = res.data.data;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatarUrl || randomAvatarUrl);
      setSuccessMsg("Đã tạo ảnh đại diện ngẫu nhiên!");
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err: any) {
      console.error("Random avatar failed:", err);
      setErrorMsg("Không thể tạo ảnh đại diện ngẫu nhiên. Vui lòng thử lại!");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flat-spacing-13">
        <div className="container-7">
          <div className="card p-4">
            <h4>Đang tải...</h4>
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
            <h4 className="mb-2">Không thể tải thông tin</h4>
            <button
              onClick={() => navigate("/account-page")}
              className="tf-btn bg-dark-2 text-white"
            >
              Quay lại
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
            <div className="card p-4">
              <h4 className="mb-4">Cập nhật thông tin cá nhân</h4>

              {/* Avatar Section */}
              <div className="mb-4 pb-4 border-bottom">
                <label className="form-label fw-medium mb-3">Ảnh đại diện</label>
                <div className="d-flex align-items-center gap-4">
                  <div className="avatar-preview" style={{ position: 'relative' }}>
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #e5e7eb',
                        cursor: 'pointer'
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getRandomAvatar(user?.email || user?.name);
                      }}
                    />
                    {uploadingAvatar && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                          color: 'white'
                        }}
                      >
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <div className="d-flex flex-column gap-2">
                      <button
                        type="button"
                        className="tf-btn btn-out-line-dark2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        {uploadingAvatar ? "Đang upload..." : "Chọn ảnh từ máy"}
                      </button>
                      <button
                        type="button"
                        className="tf-btn btn-out-line-dark2"
                        onClick={handleRandomAvatar}
                        disabled={uploadingAvatar}
                      >
                        Tạo ảnh ngẫu nhiên
                      </button>
                    </div>
                    <small className="text-muted d-block mt-2">
                      Định dạng: JPEG, PNG, GIF, WEBP. Tối đa 5MB
                    </small>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Họ và tên */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={120}
                    />
                  </div>

                  {/* Username */}
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      pattern="^[a-zA-Z0-9_]+$"
                      minLength={3}
                      maxLength={80}
                      placeholder="Chỉ chữ cái, số và dấu gạch dưới"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      readOnly
                      disabled
                    />
                    <small className="text-muted">
                      Email không thể thay đổi
                    </small>
                  </div>

                  {/* Số điện thoại */}
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="[0-9]{10,15}"
                      placeholder="0123456789"
                    />
                  </div>

                  {/* Giới tính */}
                  <div className="col-md-6">
                    <label className="form-label">Giới tính</label>
                    <select
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  {/* Ngày sinh */}
                  <div className="col-md-6">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="alert alert-success mt-3" role="alert">
                    {successMsg}
                  </div>
                )}

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="tf-btn bg-dark-2 w-100"
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>

                  <button
                    type="button"
                    className="tf-btn btn-out-line-dark2 w-100"
                    onClick={() => navigate("/account-page")}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

