import React from "react";
import { Box, Typography } from "@mui/material";

const CategoryItem = ({ category, onClick }) => {
  return (
    <Box
      sx={{
        height: "150px",
        width: "236px",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <img
        src="https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/06/Memoir-vs.-Autobiography-437x233.jpg"
        alt="Book Cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
      />
      <Box sx={{ position: "absolute", bottom: 0, left: 16 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            textShadow: "-4px 1px 6px rgba(0,0,0,0.58)",
          }}
        >
          Biographies
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            textShadow: "-4px 1px 6px rgba(0,0,0,0.58)",
          }}
        >
          300 books
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryItem;
