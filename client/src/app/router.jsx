// src/app/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import RequireAuth from "../shared/auth/RequireAuth.jsx";
import Register from "../pages/Auth/Register.jsx";
import Products from "../pages/Products.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <RequireAuth>{<Home />}</RequireAuth> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "products", element: <RequireAuth>{<Products />}</RequireAuth> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
