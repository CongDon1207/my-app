// src/app/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import RequireAuth from "../shared/auth/RequireAuth.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element:(<RequireAuth>{<Home />}</RequireAuth>) },
      { path: "/login", element: <Login /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
