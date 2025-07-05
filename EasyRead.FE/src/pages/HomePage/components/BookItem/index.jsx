import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

const BookItem = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        height: "300px",
        width: "236px",
        position: "relative",
        transition:
          "transform 0.3s cubic-bezier(.21,.6,.4,1.02), box-shadow 0.3s",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        zIndex: hovered ? 10 : 1,
        boxShadow: hovered
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          : "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        sx={{
          width: "236px",
          height: "236px",
        }}
        mb={1}
      >
        <img
          src="https://salt.tikicdn.com/cache/750x750/ts/product/e2/9e/ed/e1dbece01b595a871eadb52369e3b20c.jpg.webp"
          alt="Book Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        {hovered && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "236px",
              height: "300px",
              bgcolor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              borderRadius: "8px",
              transition: "background 0.3s",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Quick View
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h6" fontWeight={700} pl={1} mb={0.5}>
        Book Title
      </Typography>
      <Typography variant="body2" pl={1}>
        Author Name
      </Typography>
    </Box>
  );
};

export default BookItem;
