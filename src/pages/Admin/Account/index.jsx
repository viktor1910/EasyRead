import { useState } from "react";
import { Typography, Box, Button, Paper, Grid } from "@mui/material";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";

const AccountManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Lấy thông tin user từ context thay vì hardcode
  const userId = user?.id || "N/A";

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
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountManagement;
