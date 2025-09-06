import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";

const PageLayout = ({ children }) => {
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
        <Header />

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
