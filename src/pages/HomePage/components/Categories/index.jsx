import { Box, Card, Typography } from "@mui/material";
import React from "react";

import CategoryItem from "../CategoryItem";
import { useGetCategories } from "./hook.ts";

const Categories = () => {
  const { data: categories, isLoading, isError } = useGetCategories();

  if (isLoading) {
    return <Typography>Đang tải danh mục...</Typography>;
  }
  if (isError) {
    return <Typography color="error">Lỗi khi tải danh mục.</Typography>;
  }

  console.log("aaaaaa", categories);

  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="h2" mb={2}>
        Khám phá theo danh mục:
      </Typography>
      <Box display={"flex"} flexWrap="wrap" gap={3}>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        ) : (
          <Typography>Không có danh mục nào.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Categories;
