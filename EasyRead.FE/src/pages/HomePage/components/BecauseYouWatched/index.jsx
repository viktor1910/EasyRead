import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";
import Carousel from "../../../../components/Carousel";

const BecauseYouWatched = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Because you watched anime:
      </Typography>
      <Carousel items={[<BookItem />, <BookItem />, <BookItem />]} />
    </Box>
  );
};

export default BecauseYouWatched;
