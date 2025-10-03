import React from "react";
import { Box, Stack } from "@mui/material";
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
