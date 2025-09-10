import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  InputBase,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useCart } from "../context/CartContext/CartContext";
import { useNavigate, Link as RouterLink } from "react-router";

const drawerWidth = 240;

const PageLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          backgroundColor: (theme) => theme.palette.primary.main,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
          },
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
        >
          <Typography 
            variant="h6" 
            noWrap 
            sx={{ 
              flexGrow: 1,
              color: (theme) => theme.palette.primary.contrastText
            }}
          >
            EasyRead
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon
              sx={{ color: (theme) => theme.palette.primary.contrastText }}
            />
          </IconButton>
        </div>
        <List>
          <ListItem button component={RouterLink} to="/">
            <ListItemText 
              primary="Home" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/categories">
            <ListItemText 
              primary="Categories" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          {isAuthenticated() && (
            <>
              <ListItem button component={RouterLink} to="/my-account">
                <ListItemText 
                  primary="My Account" 
                  sx={{ 
                    color: (theme) => theme.palette.primary.contrastText,
                    '& .MuiListItemText-primary': {
                      color: (theme) => theme.palette.primary.contrastText
                    }
                  }} 
                />
              </ListItem>
              <ListItem button component={RouterLink} to="/orders">
                <ListItemText 
                  primary="Đơn hàng của tôi" 
                  sx={{ 
                    color: (theme) => theme.palette.primary.contrastText,
                    '& .MuiListItemText-primary': {
                      color: (theme) => theme.palette.primary.contrastText
                    }
                  }} 
                />
              </ListItem>
            </>
          )}
          {isAdmin() && (
            <ListItem button component={RouterLink} to="/admin">
              <ListItemText 
                primary="Admin Panel" 
                sx={{ 
                  color: (theme) => theme.palette.primary.contrastText,
                  '& .MuiListItemText-primary': {
                    color: (theme) => theme.palette.primary.contrastText
                  }
                }} 
              />
            </ListItem>
          )}
          
          {/* Category Navigation */}
          <ListItem button component={RouterLink} to="/categories/thieu-nhi">
            <ListItemText 
              primary="Thiếu nhi" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/categories/trinh-tham">
            <ListItemText 
              primary="Trinh thám" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/categories/kiem-hiep">
            <ListItemText 
              primary="Kiếm hiệp" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/categories/ngon-tinh">
            <ListItemText 
              primary="Ngôn tình" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/categories/best-seller">
            <ListItemText 
              primary="Bán chạy" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/new-arrivals">
            <ListItemText 
              primary="Mới về" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/sale">
            <ListItemText 
              primary="Giảm giá" 
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemText-primary': {
                  color: (theme) => theme.palette.primary.contrastText
                }
              }} 
            />
          </ListItem>
        </List>
      </Drawer>
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
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon
                sx={{ color: (theme) => theme.palette.primary.contrastText }}
              />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ 
                color: (theme) => theme.palette.primary.contrastText,
                flexGrow: 1 
              }}
            >
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
                maxWidth: 400,
              }}
            >
              <InputBase 
                sx={{ ml: 1, flex: 1 }} 
                placeholder="Tìm sách..." 
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "0 4px 4px 0" }}
              >
                <SearchIcon />
              </Button>
            </Box>

            {/* User Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
              <IconButton color="inherit">
                <FavoriteIcon sx={{ color: (theme) => theme.palette.primary.contrastText }} />
              </IconButton>
              <IconButton 
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ position: 'relative' }}
              >
                <Badge 
                  badgeContent={cart?.items_count || 0} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      minWidth: '18px',
                      height: '18px',
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ color: (theme) => theme.palette.primary.contrastText }} />
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
                  <AccountCircle sx={{ color: (theme) => theme.palette.primary.contrastText }} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
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
                      navigate('/my-account');
                    }}
                  >
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleClose();
                      navigate('/orders');
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
