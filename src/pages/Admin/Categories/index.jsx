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
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCategoryModal from "./components/AddCategory";
import { useCategories, useDeleteCategory } from "./services";

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Sử dụng react-query để fetch categories (paginated response)
  const { data: categoriesData, isLoading, error, refetch } = useCategories();
  const categories = (categoriesData && categoriesData.results) || [];
  const pagination = (categoriesData && categoriesData.pagination) || null;
  const deleteCategory = useDeleteCategory();

  console.log("Fetched categories:", categories);
  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
    // Có thể thêm refetch nếu cần thiết, tuy nhiên react-query đã tự động handle
  };

  const handleSubmitCategory = (categoryData) => {
    if (selectedCategory) {
      // TODO: Implement update API call
      console.log("Update category:", categoryData);
    }
    // Không cần xử lý create category ở đây nữa vì đã được xử lý trong AddCategoryModal
    // React-query sẽ tự động refetch data sau khi mutation thành công
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setCategoryToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete.id, {
        onSuccess: () => {
          handleCloseDeleteDialog();
        },
        onError: (error) => {
          console.error("Error deleting category:", error);
          // Có thể thêm toast notification ở đây
        },
      });
    }
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
          disabled={isLoading}
        >
          Thêm danh mục
        </Button>
      </Box>

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error.message}
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Table - chỉ hiển thị khi không loading và không có lỗi */}
      {!isLoading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <img
                        src={category.image || category.image_url}
                        alt={category.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      {/* <Avatar
                        src={category.image || category.image_url}
                        alt={category.name}
                        sx={{ width: 50, height: 50 }}
                        variant="rounded"
                      /> */}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                        }}
                      >
                        {category.slug}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(category)}
                        disabled={deleteCategory.isPending}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(category)}
                        disabled={deleteCategory.isPending}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination ? pagination.count : categories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </TableContainer>
      )}

      <AddCategoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCategory}
        initialData={selectedCategory}
        mode={selectedCategory ? "edit" : "add"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={deleteCategory.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteCategory.isPending}
            startIcon={
              deleteCategory.isPending ? <CircularProgress size={20} /> : null
            }
          >
            {deleteCategory.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
