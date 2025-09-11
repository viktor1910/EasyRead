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
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBook from "./components/AddBook";
import BookDetail from "./components/BookDetail";
import { useBooksQuery, useDeleteBookMutation } from "./hooks/useBooksQuery";

const BookManagement = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch books with React Query
  const {
    data: booksResponse,
    isLoading,
    error,
    refetch,
  } = useBooksQuery({ page: page + 1, limit: rowsPerPage });

  // Delete book mutation
  const deleteBookMutation = useDeleteBookMutation();

  const books = booksResponse?.data || [];
  const totalBooks = booksResponse?.total || books.length;

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setSelectedBook(null);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setSelectedBook(null);
    setIsEdit(false);
  };

  const handleBookSuccess = () => {
    // Refresh books data
    refetch();
  };

  const handleOpenDetailModal = (book) => {
    setSelectedBook(book);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedBook(null);
  };

  const handleEdit = (book) => {
    setIsEdit(true);
    setSelectedBook(book);
    setOpenDetailModal(false);
    setOpenAddModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteModal = (book, event) => {
    event.stopPropagation(); // Prevent row click event
    setBookToDelete(book);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setBookToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBookMutation.mutateAsync(bookToDelete.id);
        handleCloseDeleteModal();
        // Refresh data will be handled by React Query invalidation
      } catch (error) {
        console.error("Error deleting book:", error);
      }
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
        <Typography variant="h5">Quản lý sách</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Thêm sách
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên sách</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell align="right">Giá (VNĐ)</TableCell>
                <TableCell align="right">Giảm giá</TableCell>
                <TableCell align="right">Tồn kho</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Chưa có sách nào
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book, index) => (
                  <TableRow
                    key={book.id}
                    hover
                    onClick={() => handleOpenDetailModal(book)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.slug}</TableCell>
                    <TableCell>
                      {book.category?.name || book.category}
                    </TableCell>
                    <TableCell align="right">
                      {book.price?.toLocaleString("vi-VN") || 0}
                    </TableCell>
                    <TableCell align="right">{book.discount || 0}%</TableCell>
                    <TableCell align="right">{book.stock || 0}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            book.status === "available"
                              ? "success.light"
                              : "error.light",
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      >
                        {book.status === "available" ? "Còn hàng" : "Hết hàng"}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={(event) => handleOpenDeleteModal(book, event)}
                        size="small"
                        title="Xóa sách"
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
            count={totalBooks}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </TableContainer>
      )}

      <AddBook
        open={openAddModal}
        handleClose={handleCloseAddModal}
        bookData={selectedBook}
        isEdit={isEdit}
        onSuccess={handleBookSuccess}
      />

      <BookDetail
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        book={selectedBook}
        onEdit={handleEdit}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa sách</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa sách "{bookToDelete?.title}"? Hành động
            này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteBookMutation.isPending}
          >
            {deleteBookMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookManagement;
