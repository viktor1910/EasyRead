import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import PageLayout from "./layout/PageLayout";

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
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
