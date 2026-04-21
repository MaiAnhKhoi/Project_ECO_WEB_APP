import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
});

// Thêm token vào header cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi global
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // ví dụ: logout, clear token, redirect login...
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;