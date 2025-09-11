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
  Avatar,
  Chip,
} from "@mui/material";

const BookDetail = ({ open, handleClose, book, onEdit }) => {
  if (!book) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "draft":
        return "Bản nháp";
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết sách</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Book Image */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar
                src={book.image_url}
                alt={book.title}
                variant="rounded"
                sx={{
                  width: 200,
                  height: 280,
                  border: "1px solid #e0e0e0",
                }}
              />
            </Box>
          </Grid>

          {/* Book Details */}
          <Grid item xs={12} md={8}>
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
                Slug:
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                {book.slug}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Giá:
              </Typography>
              <Box>
                {book.discount > 0 ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        mr: 1,
                      }}
                    >
                      {formatPrice(book.price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="error"
                      sx={{ fontWeight: "bold" }}
                    >
                      {formatPrice(
                        calculateDiscountedPrice(book.price, book.discount)
                      )}
                    </Typography>
                    <Chip
                      label={`-${book.discount}%`}
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {formatPrice(book.price)}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Tồn kho:
              </Typography>
              <Typography variant="body1">{book.stock}</Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Trạng thái:
              </Typography>
              <Chip
                label={getStatusText(book.status)}
                color={getStatusColor(book.status)}
                size="small"
              />
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Thể loại:
              </Typography>
              <Typography variant="body1">{book.category_id}</Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Tác giả:
              </Typography>
              <Typography variant="body1">{book.author_id}</Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Năm xuất bản:
              </Typography>
              <Typography variant="body1">{book.published_year}</Typography>
            </Box>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                Nhà xuất bản:
              </Typography>
              <Typography variant="body1">{book.publisher}</Typography>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Mô tả:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
                maxHeight: 150,
                overflow: "auto",
              }}
            >
              {book.description || "Chưa có mô tả"}
            </Typography>
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
