import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";

const AddBook = ({ open, handleClose, bookData: initialBookData, isEdit }) => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
  });

  React.useEffect(() => {
    if (initialBookData) {
      setBookData(initialBookData);
    }
  }, [initialBookData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle book submission here
    console.log(bookData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Chỉnh sửa sách" : "Thêm sách mới"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên sách"
              name="title"
              value={bookData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tác giả"
              name="author"
              value={bookData.author}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Giá"
              name="price"
              type="number"
              value={bookData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Thể loại"
              name="category"
              value={bookData.category}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Cập nhật" : "Thêm sách"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBook;
