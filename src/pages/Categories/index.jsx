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
import { useMotoparts } from "../../services/motoparts";
import MotopartItem from "../HomePage/components/MotopartItem";
import { useNavigate } from "react-router";
// Import centralized categories service instead of individual useCategory
import { useCategory } from "../../services/categories/categoriesService";

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
  const { data: motoparts, isLoading: loadingMotoparts } = useMotoparts({
    category: id ? parseInt(id) : undefined,
    search: debouncedSearchKeyword || undefined,
    page: 1,
    page_size: 20,
  });

  // Get category detail when id is available
  const { data: categoryDetail, isLoading: loadingCategoryDetail } =
    useCategory(id ? parseInt(id) : undefined, { enabled: !!id });

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

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
              {id
                ? `Danh mục: ${categoryDetail?.name || id}`
                : "Tất cả danh mục"}
            </Typography>
            <TextField
              size="small"
              placeholder="Tìm kiếm phụ tùng..."
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
        </Box>

        {/* Danh sách tất cả sản phẩm */}
        <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h2" component="p" mb={2}>
            {searchKeyword
              ? `Kết quả tìm kiếm cho "${searchKeyword}"`
              : "Tất cả sản phẩm"}
          </Typography>
          {loadingMotoparts ? (
            <Typography>Đang tải...</Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {motoparts &&
              motoparts.results &&
              motoparts.results.length > 0 ? (
                motoparts.results.map((motopart) => (
                  <MotopartItem key={motopart.id} motopart={motopart} />
                ))
              ) : (
                <Typography>
                  {searchKeyword
                    ? "Không tìm thấy phụ tùng nào"
                    : "Không có phụ tùng"}
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
