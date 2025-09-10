import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";
import Carousel from "../../../../components/Carousel";
import { useGetBooks } from "./hook";

const AllProduct = () => {
  const { data } = useGetBooks();
  console.log(data);
  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="h2" component="p" mb={2}>
        Tất cả sản phẩm
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {Array.isArray(data?.data) &&
          data.data.map((book) => <BookItem key={book.id} book={book} />)}
      </Box>
    </Box>
  );
};

export default AllProduct;
