import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookTopItem from "../BookItem/BookTopItem";
import Carousel from "../../../../components/Carousel";
const TopResearch = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top Searches:
      </Typography>
      <Carousel
        items={[
          <BookTopItem top={1} />,
          <BookTopItem top={2} />,
          <BookTopItem top={3} />,
        ]}
      />
    </Box>
  );
};

export default TopResearch;
