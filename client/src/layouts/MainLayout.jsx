// client/src/layouts/MainLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return (
    <div className="min-h-screen flex flex-col">
        
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold">MyApp</Link>
          <nav>
            {auth?.user ? (
              <span className="text-sm">Xin chào, {auth.user.name}</span>
            ) : (
              <Link to="/login" className="text-blue-600">Đăng nhập</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-50 text-center py-4 text-sm">
        © Your Company
      </footer>
    </div>
  );
}