import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AddCategoryModal from "./components/AddCategory";

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dummy data - Replace with API call
  const [categories] = useState([
    { id: 1, name: "Sách Văn Học", description: "Các tác phẩm văn học" },
    { id: 2, name: "Sách Thiếu Nhi", description: "Sách dành cho trẻ em" },
    { id: 3, name: "Sách Kinh Tế", description: "Sách về kinh tế, kinh doanh" },
    // Add more dummy data here
  ]);

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const handleSubmitCategory = (categoryData) => {
    if (selectedCategory) {
      // TODO: Implement update API call
      console.log("Update category:", categoryData);
    } else {
      // TODO: Implement create API call
      console.log("New category:", categoryData);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Quản lý danh mục</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Thêm danh mục
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(category)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <AddCategoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCategory}
        initialData={selectedCategory}
        mode={selectedCategory ? "edit" : "add"}
      />
    </Box>
  );
};

export default CategoryManagement;
