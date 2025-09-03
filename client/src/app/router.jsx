// src/app/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
function HomePlaceholder() {
  return <div style={{ padding: 16 }}>Home (placeholder)</div>;
}

function LoginPlaceholder() {
  return <div style={{ padding: 16 }}>Login page (placeholder) — sẽ thay bằng form ở bước sau</div>;
}

const router = createBrowserRouter([
  { path: "/", element: <HomePlaceholder /> },
  { path: "/login", element: <Login /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
