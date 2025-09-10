import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const NoPermission = () => {
  const { user } = useAuth();

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f8f8",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 500 }}>
        <Typography variant="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Không có quyền truy cập
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          {user ? (
            <>
              Tài khoản của bạn (<strong>{user.email}</strong>) với quyền{" "}
              <strong>{user.role}</strong> không có quyền truy cập trang này.
              <br />
              Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </>
          ) : (
            "Bạn cần đăng nhập với tài khoản có quyền phù hợp để truy cập trang này."
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={handleGoHome}>
            Về trang chủ
          </Button>
          {!user && (
            <Button variant="outlined" onClick={handleLogin}>
              Đăng nhập
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NoPermission;
