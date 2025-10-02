import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MotopartItem from "../MotopartItem";
import Carousel from "../../../../components/Carousel";

const BecauseYouWatched = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Because you watched anime:
      </Typography>
      <Carousel
        items={[<MotopartItem />, <MotopartItem />, <MotopartItem />]}
      />
    </Box>
  );
};

export default BecauseYouWatched;
