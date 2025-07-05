import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";

const Top10Book = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top 10 book today:
      </Typography>
      <Stack direction="row" gap={2}>
        <BookItem />
        <BookItem />
        <BookItem />
      </Stack>
    </Box>
  );
};

export default Top10Book;
