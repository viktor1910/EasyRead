import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";

const BookDetail = ({ open, handleClose, book, onEdit }) => {
  if (!book) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết sách</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Tên sách:
              </Typography>
              <Typography variant="body1">{book.title}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Tác giả:
              </Typography>
              <Typography variant="body1">{book.author}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Thể loại:
              </Typography>
              <Typography variant="body1">{book.category}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Giá:
              </Typography>
              <Typography variant="body1">
                {book.price?.toLocaleString("vi-VN")} VNĐ
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Đã bán:
              </Typography>
              <Typography variant="body1">{book.sold}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Còn lại:
              </Typography>
              <Typography variant="body1">{book.inStock}</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        <Button
          onClick={() => onEdit(book)}
          variant="contained"
          color="primary"
        >
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookDetail;
