import axios from "axios";
import { TOKEN_KEY } from "../contexts/authProvider";

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // http://localhost:8080/api
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Attach access token
axiosAdmin.interceptors.request.use(
  (config) => {
    // Sử dụng TOKEN_KEY từ authProvider để nhất quán
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto refresh token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const REFRESH_TOKEN_KEY = "refine-refresh-token";

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Sử dụng REFRESH_TOKEN_KEY từ authProvider để nhất quán
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        localStorage.removeItem(TOKEN_KEY);
        // Không redirect ở đây, để authProvider xử lý
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const newAccessToken = res.data.data.accessToken;
          // Sử dụng TOKEN_KEY từ authProvider
          localStorage.setItem(TOKEN_KEY, newAccessToken);

          isRefreshing = false;
          onTokenRefreshed(newAccessToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          // Không redirect ở đây, để authProvider xử lý
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosAdmin(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;
