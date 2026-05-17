import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ToastContainer from "./components/Toast";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ContactUs from "./pages/ContactUs";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AddressesPage from "./pages/AddressesPage";
import VerifyPage from "./pages/VerifyPage";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuth = location.pathname === "/auth" || isAdminRoute;

  return (
    <div className={`flex flex-col min-h-screen font-manrope ${isAdminRoute ? 'bg-surface-dim' : 'bg-background'}`}>
      {!isAuth && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Protected User Routes */}
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/addresses" element={<PrivateRoute><AddressesPage /></PrivateRoute>} />

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </main>
      {!isAuth && <Footer />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}