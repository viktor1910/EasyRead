import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";

const AccountManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Lấy thông tin user từ context thay vì hardcode
  const userId = user?.id || "N/A";

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Mật khẩu mới không khớp!");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    // TODO: Gọi API để thay đổi mật khẩu
    console.log("Đổi mật khẩu:", passwords);
    setSuccess(true);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Có lỗi xảy ra khi đăng xuất");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý tài khoản
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin tài khoản
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                User ID: <strong>{userId}</strong>
              </Typography>
              <Typography variant="subtitle1">
                Tên: <strong>{user?.name || "N/A"}</strong>
              </Typography>
              <Typography variant="subtitle1">
                Email: <strong>{user?.email || "N/A"}</strong>
              </Typography>
              <Typography variant="subtitle1">
                Vai trò: <strong>{user?.role || "N/A"}</strong>
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              disabled={logoutLoading}
              sx={{ mt: 2 }}
            >
              {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đổi mật khẩu
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Mật khẩu hiện tại"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Mật khẩu mới"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                required
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Đổi mật khẩu thành công!
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Đổi mật khẩu
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountManagement;
