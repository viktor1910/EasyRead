import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import PageLayout from "./layout/PageLayout";
import AboutPage from "./pages/About";
import NotFoundPage from "./pages/404Page";
import ProtectedRoute from "./context/PermissionContext/ProtectedRoute";

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
          <ProtectedRoute>
            <PageLayout>
              <div>my account page</div>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <PageLayout>
              <div>admin page</div>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
