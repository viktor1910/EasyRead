import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import BookItem from "./components/BookItem";
import CategoryItem from "./components/CategoryItem";
import BecauseYouWatched from "./components/BecauseYouWatched";
import Top10Book from "./components/Top10Book";
import NewBooks from "./components/NewBooks";
import TopResearch from "./components/TopResearch";
import AllProduct from "./components/AllProduct";
import Categories from "./components/Categories";

const HomePage = () => (
  <Box>
    <Box sx={{ p: "4%" }}>
      <Stack direction="column" gap={4}>
        <Top10Book />
        <Categories />
        <AllProduct />
      </Stack>
    </Box>
  </Box>
);

export default HomePage;
