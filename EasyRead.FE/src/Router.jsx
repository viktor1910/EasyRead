import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import PageLayout from "./layout/PageLayout";
import AboutPage from "./pages/About";

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
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
