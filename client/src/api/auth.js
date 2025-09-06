import http from "../shared/api/http";

export async function loginApi({ email, password }) {
  const res = await http.post("/api/auth/login", { email, password });
  // Chuẩn kỳ vọng từ BE: { success, data: { user, tokens } } hoặc { success:false, error:{message} }
  if (!res?.data?.success) {
    throw new Error(res?.data?.error?.message || "Đăng nhập thất bại");
  }
  return res.data.data; // { user, tokens }
}