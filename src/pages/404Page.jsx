import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Trang không tồn tại
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
