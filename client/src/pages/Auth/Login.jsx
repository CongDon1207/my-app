// src/pages/Auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { loginApi } from "../../api/auth";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được bỏ trống"),
});

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localErrs, setLocalErrs] = useState([]);

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const { tokens, user } = data || {};
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.refreshToken,
          user,
        })
      );
      navigate("/"); // redirect Home
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setLocalErrs(parsed.error.issues.map((i) => i.message));
      return;
    }
    setLocalErrs([]);
    mutation.mutate(parsed.data);
  }

  const serverMessage = mutation.isError ? mutation.error?.message : null;
  const serverIssues =
    mutation.isError && Array.isArray(mutation.error?.issues) ? mutation.error.issues : [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Đăng nhập</h1>

        {(localErrs.length > 0 || serverMessage || serverIssues.length > 0) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="space-y-1">
              {localErrs.map((m, idx) => (
                <div key={`le-${idx}`} className="text-sm text-red-700">{m}</div>
              ))}
              {serverMessage && (
                <div className="text-sm text-red-700">{serverMessage}</div>
              )}
              {serverIssues.map((it, idx) => (
                <div key={`se-${idx}`} className="text-sm text-red-700">
                  {it.message || `${it.path?.join('.')}: ${it.code}`}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
