import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Divider, List, ListItem, Stack } from "@mui/material";
import { useParams } from "react-router";
import Categories from "../HomePage/components/Categories";
import AllProduct from "../HomePage/components/AllProduct";
import BookItem from "../HomePage/components/BookItem";

const CategoriesPage = () => {
  const { id } = useParams();

  return (
    <Box display={"flex"} gap={3} padding={4} minHeight="100vh">
      {/* Sidebar danh mục bên trái - fixed width */}
      <Box
        width={"250px"}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          flexShrink: 0,
          alignSelf: "flex-start",
          position: "sticky", // Optional: để sidebar sticky khi scroll
          top: "20px", // Optional: khoảng cách từ top khi sticky
        }}
      >
        <Typography variant="h2" mt={3} ml={2}>
          Danh mục
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <List>
          <ListItem button>Vật lý</ListItem>
        </List>
        <List>
          <ListItem button>Hóa học</ListItem>
        </List>
      </Box>

      {/* Phần content bên phải - tự scale */}
      <Stack gap={3} flexGrow={1} minWidth={0}>
        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h1">{id}</Typography>
          <Box display={"flex"} flexWrap="wrap" gap={3}></Box>
        </Box>

        <Categories />

        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h2" component="p" mb={2}>
            Tất cả sản phẩm
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <BookItem />
            <BookItem />
            <BookItem />
            <BookItem />
            <BookItem />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CategoriesPage;
