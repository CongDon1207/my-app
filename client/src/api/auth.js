import http from "../shared/api/http";

export async function loginApi({ email, password }) {
  const res = await http.post("/auth/login", { email, password });
  // Chuẩn kỳ vọng từ BE: { success, data: { user, tokens } } hoặc { success:false, error:{message} }
  if (!res?.data?.success) {
    throw new Error(res?.data?.error?.message || "Đăng nhập thất bại");
  }
  return res.data.data; // { user, tokens }
}

export async function registerApi({ name, email, password }) {
  const res = await http.post("/auth/register", { name, email, password });
  if (!res?.data?.success) {
    throw new Error(res?.data?.error?.message || "Đăng ký thất bại");
  }
  return res.data.data; // { user }
}

export async function logoutApi() {
  const res = await http.post('/auth/logout'); // hoặc delete
  if (!res?.data?.success) throw new Error('Logout failed');
  return res.data;
}
