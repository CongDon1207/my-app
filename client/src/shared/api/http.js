// src/shared/api/http.js
import axios from "axios";

const http = axios.create({
  baseURL: "/api", // BE đang mount /api (vd: /api/auth/login)
  withCredentials: false,
});

function getAccessToken() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const { accessToken } = JSON.parse(raw);
    return accessToken || null;
  } catch {
    return null;
  }
}

// Gắn Authorization trước khi gửi request
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Chuẩn hoá lỗi từ server
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const fallback = { message: "Network/Server error", status: 500 };
    const payload = error?.response?.data || { success: false, error: fallback };
    return Promise.reject(payload?.error || fallback);
  }
);

export default http;
