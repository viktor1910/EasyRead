import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Divider, List, ListItem, Stack } from "@mui/material";
import { useParams } from "react-router";
import { useGetCategories } from "../HomePage/components/Categories/hook";
import { useGetBooks } from "../HomePage/components/AllProduct/hook";
import BookItem from "../HomePage/components/BookItem";
import { useNavigate } from "react-router";
const CategoriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const { data: books, isLoading: loadingBooks } = useGetBooks({
    category_id: id,
  });

  console.log("CategoriesPage books", books);
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
          position: "sticky",
          top: "20px",
        }}
      >
        <Typography variant="h2" mt={3} ml={2}>
          Danh mục
        </Typography>
        <Divider sx={{ mt: 2, mb: 1 }} />
        {loadingCategories ? (
          <Typography ml={2}>Đang tải...</Typography>
        ) : (
          <List>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <ListItem
                  button
                  key={cat.id}
                  selected={String(cat.id) === id}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                >
                  {cat.name}
                </ListItem>
              ))
            ) : (
              <Typography ml={2}>Không có danh mục</Typography>
            )}
          </List>
        )}
      </Box>

      {/* Phần content bên phải - tự scale */}
      <Stack gap={3} flexGrow={1} minWidth={0}>
        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h1">
            {id ? `Danh mục: ${id}` : "Tất cả danh mục"}
          </Typography>
          {/* Có thể thêm filter theo id ở đây nếu muốn */}
        </Box>

        {/* Danh sách tất cả sản phẩm */}
        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h2" component="p" mb={2}>
            Tất cả sản phẩm
          </Typography>
          {loadingBooks ? (
            <Typography>Đang tải...</Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {books && books.data && books.data.length > 0 ? (
                books.data.map((book) => <BookItem key={book.id} book={book} />)
              ) : (
                <Typography>Không có sách</Typography>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default CategoriesPage;
