// src/app/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "products", element: <Products /> },
      { path: "products/:slug", element: <ProductDetail /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
