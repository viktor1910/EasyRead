import React from "react";
import { Box, InputBase, Button, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router";
import CartIcon from "../../components/CartIcon";

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 5,
          py: 1,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="EasyRead"
              style={{
                height: "40px",
                width: "auto",
              }}
            />
          </Box>
        </Link>

        {/* Search Bar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            mx: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tìm phụ tùng..." />
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: "0 4px 4px 0" }}
          >
            <SearchIcon />
          </Button>
        </Box>

        {/* User Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            to="/my-account"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Tài khoản
          </Link>
          <IconButton color="inherit">
            <FavoriteIcon />
          </IconButton>
          <CartIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
