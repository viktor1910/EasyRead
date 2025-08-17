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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const PageLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

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
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            EasyRead
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon
              sx={{ color: (theme) => theme.palette.primary.contrastText }}
            />
          </IconButton>
        </div>
        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Library" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
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
              sx={{ color: (theme) => theme.palette.primary.contrastText }}
            >
              EasyRead
            </Typography>
          </Toolbar>
        </AppBar>

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
