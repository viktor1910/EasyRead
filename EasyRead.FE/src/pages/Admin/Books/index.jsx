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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddBook from "./components/AddBook";
import BookDetail from "./components/BookDetail";

const BookManagement = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Mock data - replace with actual API data later
  const [books] = useState([
    {
      id: 1,
      title: "Sách mẫu 1",
      author: "Tác giả 1",
      price: 150000,
      sold: 25,
      inStock: 75,
      category: "Văn học",
    },
    {
      id: 2,
      title: "Sách mẫu 2",
      author: "Tác giả 2",
      price: 200000,
      sold: 15,
      inStock: 85,
      category: "Khoa học",
    },
  ]);

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

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên sách</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell align="right">Giá (VNĐ)</TableCell>
              <TableCell align="right">Đã bán</TableCell>
              <TableCell align="right">Còn lại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book, index) => (
                <TableRow
                  key={book.id}
                  hover
                  onClick={() => handleOpenDetailModal(book)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell align="right">
                    {book.price.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell align="right">{book.sold}</TableCell>
                  <TableCell align="right">{book.inStock}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </TableContainer>

      <AddBook
        open={openAddModal}
        handleClose={handleCloseAddModal}
        bookData={selectedBook}
        isEdit={isEdit}
      />

      <BookDetail
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        book={selectedBook}
        onEdit={handleEdit}
      />
    </Box>
  );
};

export default BookManagement;
