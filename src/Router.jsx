import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import PageLayout from "./layout/PageLayout";
import AboutPage from "./pages/About";
import NotFoundPage from "./pages/404Page";
import CategoriesPage from "./pages/Categories";
import ProtectedRoute from "./context/PermissionContext/ProtectedRoute";
import BookDetail from "./pages/Book";
import AdminPage from "./pages/Admin";
import AuthProtectedRoute from "./context/AuthContext/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout>
            <HomePage />
          </PageLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PageLayout>
            <AboutPage />
          </PageLayout>
        }
      />
      <Route
        path="/my-account"
        element={
          <AuthProtectedRoute requireUser={true}>
            <PageLayout>
              <MyAccountPage />
            </PageLayout>
          </AuthProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthProtectedRoute requireAdmin={true}>
            <AdminPage />
          </AuthProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route
        path="/about-me"
        element={
          <PageLayout>
            <AboutPage />
          </PageLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <PageLayout>
            <CategoriesPage />
          </PageLayout>
        }
      />
      <Route
        path="/categories/:id"
        element={
          <PageLayout>
            <CategoriesPage />
          </PageLayout>
        }
      />
      <Route
        path="/book/:slug"
        element={
          <PageLayout>
            <BookDetail />
          </PageLayout>
        }
      />
      <Route
        path="/books/:id"
        element={
          <PageLayout>
            <BookDetail />
          </PageLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PageLayout>
            <LoginPage />
          </PageLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PageLayout>
            <RegisterPage />
          </PageLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <AuthProtectedRoute requireUser={true}>
            <PageLayout>
              <CartPage />
            </PageLayout>
          </AuthProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <AuthProtectedRoute requireUser={true}>
            <PageLayout>
              <OrdersPage />
            </PageLayout>
          </AuthProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
