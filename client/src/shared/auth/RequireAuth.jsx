// client/src/shared/auth/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";

export function getAuth() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Điều kiện tối thiểu để coi là đã đăng nhập
    if (parsed?.accessToken && parsed?.user) return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function RequireAuth({ children }) {
  const location = useLocation();
  const auth = getAuth();

  if (!auth) {
    // Lưu lại vị trí để sau này đăng nhập xong có thể quay lại
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
