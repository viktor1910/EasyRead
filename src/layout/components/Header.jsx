import React from "react";
import { Box, InputBase, Button, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router";

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
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          EasyRead
        </Typography>

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
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tìm sách..." />
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
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Box
        sx={{
          bgcolor: "grey.100",
          px: 4,
          py: 1,
        }}
      >
        <Box
          component="nav"
          sx={{
            display: "flex",
            gap: 3,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Trang chủ
          </Link>
          <Link
            to="/categories/thieu-nhi"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Thiếu nhi
          </Link>
          <Link
            to="/categories/trinh-tham"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Trinh thám
          </Link>
          <Link
            to="/categories/kiem-hiep"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Kiếm hiệp
          </Link>
          <Link
            to="/categories/ngon-tinh"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Ngôn tình
          </Link>
          <Link
            to="/categories/best-seller"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Bán chạy
          </Link>
          <Link
            to="/new-arrivals"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Mới về
          </Link>
          <Link
            to="/sale"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            Giảm giá
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
