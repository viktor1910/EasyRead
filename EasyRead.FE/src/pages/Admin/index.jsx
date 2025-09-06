import React from "react";
import { Box, Typography } from "@mui/material";
import AdminLayout from "./components/AdminLayout";
import { Routes, Route } from "react-router";
import BookManagement from "./Books";
import CategoryManagement from "./Categories";
import ShippingManagement from "./Shipping";
import AccountManagement from "./Account";

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bảng điều khiển
      </Typography>
      <Typography>
        Chào mừng đến với trang quản trị. Vui lòng chọn mục cần quản lý từ menu
        bên phải.
      </Typography>
    </Box>
  );
};

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/books" element={<BookManagement />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/shipping" element={<ShippingManagement />} />
        <Route path="/account" element={<AccountManagement />} />
      </Routes>
    </AdminLayout>
  );
};
export default AdminPage;
