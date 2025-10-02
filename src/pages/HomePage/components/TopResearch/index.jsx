import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MotopartTopItem from "../MotopartItem/MotopartTopItem";
import Carousel from "../../../../components/Carousel";
const TopResearch = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top Searches:
      </Typography>
      <Carousel
        items={[
          <MotopartTopItem top={1} />,
          <MotopartTopItem top={2} />,
          <MotopartTopItem top={3} />,
        ]}
      />
    </Box>
  );
};

export default TopResearch;
