import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useParams, useSearchParams } from "react-router";
import { useGetCategories } from "../HomePage/components/Categories/hook";
import { useGetBooks } from "../HomePage/components/AllProduct/hook";
import BookItem from "../HomePage/components/BookItem";
import { useNavigate } from "react-router";
const CategoriesPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  // Initialize search keyword from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchKeyword(searchFromUrl);
      setDebouncedSearchKeyword(searchFromUrl);
    }
  }, [searchParams]);

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const { data: books, isLoading: loadingBooks } = useGetBooks({
    category_id: id,
    keyword: debouncedSearchKeyword || undefined,
  });

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h1">
              {id ? `Danh mục: ${id}` : "Tất cả danh mục"}
            </Typography>
            <TextField
              size="small"
              placeholder="Tìm kiếm sách..."
              value={searchKeyword}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchKeyword && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      title="Xóa tìm kiếm"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>
        </Box>{" "}
        {/* Danh sách tất cả sản phẩm */}
        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h2" component="p" mb={2}>
            {searchKeyword
              ? `Kết quả tìm kiếm cho "${searchKeyword}"`
              : "Tất cả sản phẩm"}
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
                <Typography>
                  {searchKeyword ? "Không tìm thấy sách nào" : "Không có sách"}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default CategoriesPage;
