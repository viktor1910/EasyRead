import React, { useState, useEffect } from "react";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useCart } from "../context/CartContext/CartContext";
import { useNavigate, Link as RouterLink } from "react-router";
import { useGetBooks } from "../pages/HomePage/components/AllProduct/hook";

const drawerWidth = 240;

const PageLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useGetBooks({
    keyword: debouncedSearchKeyword || undefined,
    pageSize: 10, // Limit search results
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    if (searchKeyword) {
      setShowSearchResults(true);
    }
  };

  const handleClickAway = () => {
    setShowSearchResults(false);
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.slug || book.id}`);
    setShowSearchResults(false);
    setSearchKeyword("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchKeyword)}`);
      setShowSearchResults(false);
    }
  };

  const hasSearchResults =
    searchResults && searchResults.data && searchResults.data.length > 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#e0d8d7",
          width: "99vw",
        }}
      >
        <AppBar
          position="static"
          color="default"
          sx={{
            boxShadow: "none",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
                flexGrow: 1,
              }}
            >
              EasyRead
            </Typography>

            {/* Search Bar */}
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ position: "relative", flex: 1, mx: 2, maxWidth: 400 }}>
                <Box
                  component="form"
                  onSubmit={handleSearchSubmit}
                  sx={{
                    display: "flex",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Tìm sách..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "0 4px 4px 0" }}
                  >
                    {isSearching ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SearchIcon />
                    )}
                  </Button>
                </Box>

                {/* Search Results Dropdown */}
                {showSearchResults && debouncedSearchKeyword && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      maxHeight: 400,
                      overflow: "auto",
                      mt: 1,
                      boxShadow: 3,
                    }}
                  >
                    {isSearching ? (
                      <Box
                        sx={{ p: 2, display: "flex", justifyContent: "center" }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : hasSearchResults ? (
                      <List sx={{ py: 0 }}>
                        {searchResults.data.slice(0, 8).map((book) => (
                          <ListItem
                            key={book.id}
                            button
                            onClick={() => handleBookClick(book)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={book.image_full_url || book.image_url}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              >
                                {book.title.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {book.title}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {book.price?.toLocaleString("vi-VN")} VNĐ
                                  </Typography>
                                  {book.discount > 0 && (
                                    <Typography
                                      variant="caption"
                                      color="error.main"
                                      sx={{ ml: 1 }}
                                    >
                                      -{book.discount}%
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                        {searchResults.data.length > 8 && (
                          <ListItem
                            button
                            onClick={() => {
                              navigate(
                                `/categories?search=${encodeURIComponent(
                                  searchKeyword
                                )}`
                              );
                              setShowSearchResults(false);
                            }}
                            sx={{
                              backgroundColor: "grey.50",
                              "&:hover": {
                                backgroundColor: "grey.100",
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, textAlign: "center" }}
                                >
                                  Xem tất cả {searchResults.total} kết quả
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Không tìm thấy sách nào
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>

            {/* User Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
              <IconButton color="inherit">
                <FavoriteIcon
                  sx={{ color: (theme) => theme.palette.primary.contrastText }}
                />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => navigate("/cart")}
                sx={{ position: "relative" }}
              >
                <Badge
                  badgeContent={cart?.items_count || 0}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      minWidth: "18px",
                      height: "18px",
                    },
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      color: (theme) => theme.palette.primary.contrastText,
                    }}
                  />
                </Badge>
              </IconButton>
            </Box>

            {/* Auth buttons */}
            {isAuthenticated() ? (
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle
                    sx={{
                      color: (theme) => theme.palette.primary.contrastText,
                    }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Typography variant="body2">
                      Xin chào, {user?.name}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/my-account");
                    }}
                  >
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/orders");
                    }}
                  >
                    Đơn hàng của tôi
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ color: (theme) => theme.palette.primary.contrastText }}
                >
                  Đăng nhập
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{ color: (theme) => theme.palette.primary.contrastText }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Navigation Bar */}
        <Box
          sx={{
            bgcolor: "grey.100",
            px: 4,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            component="nav"
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Trang chủ
            </Button>
            {isAuthenticated() && (
              <Button
                component={RouterLink}
                to="/orders"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Đơn hàng
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/categories/thieu-nhi"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Thiếu nhi
            </Button>
            <Button
              component={RouterLink}
              to="/categories/trinh-tham"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Trinh thám
            </Button>
            <Button
              component={RouterLink}
              to="/categories/kiem-hiep"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Kiếm hiệp
            </Button>
            <Button
              component={RouterLink}
              to="/categories/ngon-tinh"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Ngôn tình
            </Button>
            <Button
              component={RouterLink}
              to="/categories/best-seller"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Bán chạy
            </Button>
            <Button
              component={RouterLink}
              to="/new-arrivals"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Mới về
            </Button>
            <Button
              component={RouterLink}
              to="/sale"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Giảm giá
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <main style={{ flex: 1, overflow: "hidden" }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            padding: "1rem",
            background: "#f5f5f5",
            borderTop: "1px solid #e0e0e0",
            textAlign: "center",
          }}
        >
          &copy; {new Date().getFullYear()} EasyRead. All rights reserved.
        </footer>
      </Box>
    </div>
  );
};

export default PageLayout;
