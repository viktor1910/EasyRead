import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookItem from "../BookItem";

const ContinueWatching = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Continue watching:
      </Typography>
      <Stack direction="row" gap={2}>
        <BookItem />
        <BookItem />
        <BookItem />
      </Stack>
    </Box>
  );
};

export default ContinueWatching;
