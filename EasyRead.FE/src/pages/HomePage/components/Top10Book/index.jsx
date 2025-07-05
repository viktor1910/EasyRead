import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";
import BookTopItem from "../BookItem/BookTopItem";
import Carousel from "../../../../components/Carousel";
const Top10Book = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top 10 book today:
      </Typography>

      <Carousel
        items={[
          <BookTopItem top={1} />,
          <BookTopItem top={2} />,
          <BookTopItem top={3} />,
          <BookTopItem top={4} />,
          <BookTopItem top={5} />,
          <BookTopItem top={6} />,
          <BookTopItem top={7} />,
          <BookTopItem top={8} />,
          <BookTopItem top={9} />,
          <BookTopItem top={10} />,
        ]}
      />
    </Box>
  );
};

export default Top10Book;
