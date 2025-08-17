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
    <Box width="100%" mb={4} position="relative">
      <img
        src="https://static-cse.canva.com/blob/1427864/ImagebyStanislavKondratievviaUnsplash.5b005b3e.avif"
        alt="Welcome to EasyRead"
        style={{ width: "100%", height: "auto" }}
      />
      <Typography
        variant="h4"
        component="p"
        mt={2}
        mb={2}
        sx={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          transform: "translate(-50%, 50%)",
          color: "#fff",
          textShadow: "-2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        Welcome to EasyRead
      </Typography>
    </Box>
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
