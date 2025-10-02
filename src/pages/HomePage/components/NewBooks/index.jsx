import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MotopartItem from "../MotopartItem";
import Carousel from "../../../../components/Carousel";
const NewMotoparts = () => {
  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        New motoparts on EasyRead:
      </Typography>
      <Carousel
        items={[<MotopartItem />, <MotopartItem />, <MotopartItem />]}
      />
    </Box>
  );
};

export default NewMotoparts;
