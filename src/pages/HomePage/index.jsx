import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import MotopartItem from "./components/MotopartItem";
import CategoryItem from "./components/CategoryItem";
import BecauseYouWatched from "./components/BecauseYouWatched";
import Top10Motopart from "./components/Top10Book";
import NewMotoparts from "./components/NewBooks";
import TopResearch from "./components/TopResearch";
import AllProduct from "./components/AllProduct";
import Categories from "./components/Categories";

const HomePage = () => (
  <Box>
    <Box sx={{ p: "4%" }}>
      <Stack direction="column" gap={4}>
        <Categories />
        <AllProduct />
      </Stack>
    </Box>
  </Box>
);

export default HomePage;
