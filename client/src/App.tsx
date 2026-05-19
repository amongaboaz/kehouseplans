/**
 * Root routes — storefront, auth, admin; theme-aware toasts.
 */
import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import { useTheme } from "next-themes"

import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductsPage from "./pages/ProductsPage"
import Checkout from "./pages/Checkout"
import MyOrders from "./pages/MyOrders"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminProductForm from "./pages/admin/AdminProductForm"
import AdminOrders from "./pages/admin/AdminOrders"

const App = () => {
  const { resolvedTheme } = useTheme()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: resolvedTheme === "dark" ? "#1e293b" : "#0f172a",
            color: "#fff",
            borderRadius: "16px",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="flex-center min-h-[50vh] text-muted-foreground">
                404 — Page not found
              </div>
            }
          />
        </Route>

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
