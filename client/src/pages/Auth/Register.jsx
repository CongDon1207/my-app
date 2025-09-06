// client/src/pages/Auth/Register.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import http from "../../shared/api/http";
import { registerApi } from "../../api/auth";

const RegisterSchema = z
  .object({
    name: z.string().min(1, "Vui lòng nhập tên").optional(),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    root: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      // Đăng ký xong -> quay về login
      const from = location.state?.from?.pathname || "/login";
      navigate(from);
    },
    onError: (err) => {
      setErrors((e) => ({ ...e, root: err?.message || "Đăng ký thất bại" }));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" })); // clear field error khi gõ
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ name: "", email: "", password: "", confirmPassword: "", root: "" });
    const parsed = RegisterSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = { name: "", email: "", password: "", confirmPassword: "", root: "" };
      parsed.error.issues.forEach((i) => {
        const key = i.path?.[0];
        if (key && !fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const { name, email, password } = parsed.data;
    mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4">Đăng ký</h1>

        <label className="block mb-2">
          <span className="text-sm">Họ tên</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </label>

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </label>

        <label className="block mb-2">
          <span className="text-sm">Mật khẩu</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </label>

        <label className="block mb-4">
          <span className="text-sm">Xác nhận mật khẩu</span>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </label>

        {errors.root && (
          <div className="mb-3 rounded-lg border p-2 text-red-700 text-sm">{errors.root}</div>
        )}

        <button type="submit" disabled={isPending} className="w-full rounded-xl p-2 border shadow">
          {isPending ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <div className="text-sm mt-3">
          Đã có tài khoản?{" "}
          <Link to="/login" className="underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
