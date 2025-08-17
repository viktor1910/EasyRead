import React from "react";
import { Box, Typography } from "@mui/material";

const CategoryItem = ({ category, onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          height: "150px",
          width: "150px",
          borderRadius: "50%",
          overflow: "hidden",
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
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            textShadow: "-4px 1px 6px rgba(0,0,0,0.58)",
          }}
        >
          Biographies
        </Typography>
        <Typography
          variant="body2"
          sx={{
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
