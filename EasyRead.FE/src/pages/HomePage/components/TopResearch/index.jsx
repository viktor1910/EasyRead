import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookTopItem from "../BookItem/BookTopItem";

const TopResearch = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top Searches:
      </Typography>
      <Stack direction="row" gap={2}>
        <BookTopItem top={1} />
        <BookTopItem top={2} />
        <BookTopItem top={3} />
      </Stack>
    </Box>
  );
};

export default TopResearch;
