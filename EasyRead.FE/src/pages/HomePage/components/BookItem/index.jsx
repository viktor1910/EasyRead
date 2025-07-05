import React from "react";
import { Box, Typography } from "@mui/material";

const BookItem = () => (
  <Box
    sx={{
      height: "300px",
      width: "236px",
    }}
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
        }}
      />
    </Box>
    <Typography variant="h6" fontWeight={700}>
      Book Title
    </Typography>
    <Typography variant="body2">Author Name</Typography>
  </Box>
);

export default BookItem;
