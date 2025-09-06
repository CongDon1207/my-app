// src/app/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

function HomePlaceholder() {
  return <div style={{ padding: 16 }}></div>;
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePlaceholder /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
