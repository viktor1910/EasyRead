import { Box, Card, Typography } from "@mui/material";
import React from "react";
import CategoryItem from "../CategoryItem";

const Categories = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="h2" mb={2}>
        Khám phá theo danh mục:
      </Typography>
      <Box display={"flex"} flexWrap="wrap" gap={3}>
        <CategoryItem />
      </Box>
    </Box>
  );
};

export default Categories;
