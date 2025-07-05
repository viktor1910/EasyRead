import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";

const BecauseYouWatched = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Because you watched anime:
      </Typography>
      <Stack direction="row" gap={2}>
        <BookItem />
        <BookItem />
        <BookItem />
      </Stack>
    </Box>
  );
};

export default BecauseYouWatched;
