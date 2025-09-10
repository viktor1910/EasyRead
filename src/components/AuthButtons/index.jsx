import React from "react";
import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRoleCheck } from "../../hooks/useRoleCheck";

const AuthButtons = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin } = useRoleCheck();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    window.location.href = "/";
  };

  const handleProfile = () => {
    handleMenuClose();
    window.location.href = "/my-account";
  };

  const handleAdmin = () => {
    handleMenuClose();
    window.location.href = "/admin";
  };

  if (!isAuthenticated()) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => (window.location.href = "/login")}
        >
          Đăng nhập
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => (window.location.href = "/register")}
        >
          Đăng ký
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Xin chào, {user?.name}
      </Typography>
      <Button
        size="small"
        onClick={handleMenuOpen}
        sx={{ textTransform: "none" }}
      >
        Tài khoản
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>Thông tin tài khoản</MenuItem>
        {isAdmin() && <MenuItem onClick={handleAdmin}>Quản trị</MenuItem>}
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </Box>
  );
};

export default AuthButtons;
