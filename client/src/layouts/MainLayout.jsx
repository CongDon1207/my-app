// client/src/layouts/MainLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getAuth } from "../shared/auth/RequireAuth";
import { logoutApi } from "../api/auth";

export default function MainLayout() {
  const auth = getAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Thử gọi API logout nếu backend hỗ trợ (hiện backend là no-op)
      await logoutApi();
    } catch (error) {
      // Không block UI nếu API lỗi; vẫn xóa localStorage
      console.error("Logout failed (api):", error);
    } finally {
      localStorage.removeItem("auth");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
        
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold">MyApp</Link>
          <nav>
            {auth?.user ? (
              <>
                <span className="text-sm">Xin chào, {auth?.user?.name || auth?.user?.email || "bạn"}</span>
                <button onClick={handleLogout} className="ml-4 text-red-600">Đăng xuất</button>
              </>
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
