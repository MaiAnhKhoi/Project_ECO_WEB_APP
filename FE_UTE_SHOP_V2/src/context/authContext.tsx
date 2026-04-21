import { createContext, useContext, useEffect, useState } from "react";
import authApi, { User, Role } from "@/services/authApi";

interface LoginResult {
  success: boolean;
  message?: string;
  emailNotVerified?: boolean;
  accountLocked?: boolean;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const isCustomerAccount = (roles?: Role[]) => {
  if (!roles?.length) return false;
  return roles.some((role) => {
    const code = role.code?.toUpperCase?.();
    return code === "USER" || code === "CUSTOMER";
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user khi refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getProfile()
      .then((res) => {
        const profile = res.data.data;
        if (!isCustomerAccount(profile.roles)) {
          localStorage.removeItem("access_token");
          setUser(null);
          return;
        }
        setUser(profile);
      })
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  // -------------- LOGIN FIXED --------------
  const login = async (email: string, password: string): Promise<LoginResult> => {
    console.log("👉 Bắt đầu login với:", { email, password });

    try {
      const res = await authApi.login({ email, password });

      console.log("👉 API trả về:", res);

      const { accessToken, user } = res.data.data;

      if (!isCustomerAccount(user.roles)) {
        return {
          success: false,
          message: "Chỉ tài khoản khách hàng mới được đăng nhập khu vực này.",
        };
      }

      localStorage.setItem("access_token", accessToken);
      setUser(user);

      console.log("✔ Đăng nhập thành công");

      return { success: true };
    } catch (err: any) {
      console.error("❌ Lỗi đăng nhập:", err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.message || "Email hoặc mật khẩu không đúng!";
      
      // Check if email not verified
      const isEmailNotVerified = 
        errorMessage.includes("verified") || 
        errorMessage.includes("xác thực") ||
        errorMessage.includes("PENDING");

      // Check if account is locked
      const isAccountLocked = 
        errorMessage.includes("khóa") || 
        errorMessage.includes("locked") ||
        errorMessage.includes("LOCKED");

      return {
        success: false,
        message: errorMessage,
        emailNotVerified: isEmailNotVerified,
        accountLocked: isAccountLocked,
      };
    }
  };
  // -----------------------------------------

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
