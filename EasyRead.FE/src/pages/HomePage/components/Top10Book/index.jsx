import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";
import BookTopItem from "../BookItem/BookTopItem";

const Top10Book = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top 10 book today:
      </Typography>
      <Stack direction="row" gap={2}>
        <BookTopItem top={1} />
        <BookTopItem top={2} />
        <BookTopItem top={3} />
      </Stack>
    </Box>
  );
};

export default Top10Book;
