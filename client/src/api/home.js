// client/src/api/home.js
import http from "../shared/api/http"; // nếu http.js export named, đổi import tương ứng

export async function getHome() {
  // Chú ý: axios instance đã có baseURL = "/api" (xem src/shared/api/http.js)
  // nên chỉ cần gọi "/home" để tránh double prefix "/api/api/..."
  const res = await http.get("/home");
  if (!res?.data?.success) {
    throw new Error(res?.data?.error?.message || "Không thể tải dữ liệu Home");
  }
  const data = res.data.data || {};
  // Backend hiện trả `featured` (mock). Frontend kỳ vọng `featuredProducts`.
  return {
    message: data.message,
    featuredProducts: data.featured || data.featuredProducts || [],
    categories: data.categories || [],
  };
}
  