import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const NoPermission = () => (
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
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h1" color="error" gutterBottom>
        403
      </Typography>
      <Typography variant="h5" color="textPrimary" gutterBottom>
        No Permission
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 400 }}>
        You do not have permission to access this page. Please contact your
        administrator if you believe this is a mistake.
      </Typography>
    </Paper>
  </Box>
);

export default NoPermission;
