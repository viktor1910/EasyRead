import React, { useState } from "react";
import {
  Button,
  Card,
  Rating,
  Chip,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams } from "react-router";
import { useGetBookDetail } from "./hook";

const BookDetail = () => {
  const { id } = useParams();
  const { data: book, isLoading, error } = useGetBookDetail(id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (val) => {
    if (val < 1) setQuantity(1);
    else if (val > 99) setQuantity(99);
    else setQuantity(val);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Không thể tải thông tin sách. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  // No book found
  if (!book) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Không tìm thấy sách với ID này.
        </Alert>
      </Box>
    );
  }

  // Calculate final price with discount
  const finalPrice = book.discount 
    ? book.price - (book.price * book.discount / 100)
    : book.price;

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={4}
      p="32px 16px"
      bgcolor="#fff"
      minHeight="100vh"
    >
      {/* Left: Images */}
      <Box
        flex="0 0 340px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          src={book.image_full_url || book.image_url}
          alt={book.title}
          width={320}
          height={400}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        {/* For now, we'll just show the main image since we don't have multiple images */}
        {/* You can add thumbnail functionality later if needed */}
      </Box>

      {/* Middle: Book Info */}
      <Box flex="1 1 0" maxWidth={520} px={3}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {book.title}
        </Typography>
        <Box mb={1} display="flex" gap={1}>
          <Chip label="FREESHIP XTRA" color="primary" size="small" />
          <Chip label="30 NGÀY ĐỔI TRẢ" color="success" size="small" />
          <Chip label="CHÍNH HÃNG" color="warning" size="small" />
        </Box>
        <Box mb={1}>
          <span>Tác giả: </span>
          <span>{book.author?.name || 'Chưa cập nhật'}</span>
        </Box>
        <Box mb={1}>
          <span>Nhà xuất bản: </span>
          <span>{book.publisher}</span>
        </Box>
        <Box mb={1}>
          <span>Năm xuất bản: </span>
          <span>{book.published_year}</span>
        </Box>
        <Box mb={1}>
          <span>Thể loại: </span>
          <span>{book.category?.name || 'Chưa phân loại'}</span>
        </Box>
        <Box mb={1}>
          <span>Tình trạng: </span>
          <Chip 
            label={book.stock > 0 ? 'Còn hàng' : 'Hết hàng'} 
            color={book.stock > 0 ? 'success' : 'error'} 
            size="small" 
          />
        </Box>
        <Box mb={1} display="flex" alignItems="center" gap={2}>
          {book.discount && (
            <Typography fontSize={20} color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {book.price.toLocaleString('vi-VN')}đ
            </Typography>
          )}
          <Typography fontSize={28} fontWeight={600} color="#d0011b">
            {finalPrice.toLocaleString('vi-VN')}đ
          </Typography>
          {book.discount && (
            <Chip 
              label={`-${book.discount}%`} 
              color="error" 
              size="small" 
            />
          )}
        </Box>
        <Box mb={2} display="flex" alignItems="center" gap={1}>
          <Rating value={5} readOnly size="small" />
          <span>(4 đánh giá)</span>
        </Box>
        <Card
          variant="outlined"
          sx={{ background: "#fafafa", mb: 2, p: 2, boxShadow: "none" }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTimeOutlinedIcon sx={{ mr: 1 }} />
            Giao đến <b>TP. Hạ Long, P. Hồng Hải, Quảng Ninh</b>
          </Box>
          <Box>
            <span style={{ color: "#52c41a" }}>Miễn phí</span> vận chuyển cho
            đơn từ 45k
          </Box>
        </Card>
        <Card
          variant="outlined"
          sx={{ background: "#fafafa", p: 2, boxShadow: "none" }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <CreditCardOutlinedIcon sx={{ mr: 1 }} />
            Ưu đãi đến 600k với thẻ TikiCard
          </Box>
          <Box display="flex" alignItems="center">
            <ShoppingCartOutlinedIcon sx={{ mr: 1 }} />
            Mua trước trả sau
          </Box>
        </Card>
        
        {/* Book Description */}
        {book.description && (
          <Card variant="outlined" sx={{ mt: 2, p: 2, boxShadow: "none" }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {book.description}
            </Typography>
          </Card>
        )}
      </Box>

      {/* Right: Purchase */}
      <Box
        flex="0 0 320px"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Card sx={{ p: 2 }}>
          <Typography fontSize={20} fontWeight={600} color="#d0011b" mb={2}>
            {finalPrice.toLocaleString('vi-VN')}đ
          </Typography>
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <span>Số lượng: </span>
            <TextField
              type="number"
              size="small"
              value={quantity}
              inputProps={{
                min: 1,
                max: 99,
                style: { width: 50, textAlign: "center" },
              }}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 99}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mb: 1, fontWeight: 600 }}
            disabled={book.stock <= 0}
          >
            {book.stock <= 0 ? 'Hết hàng' : 'Mua ngay'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartOutlinedIcon />}
            fullWidth
            sx={{ mb: 1 }}
            disabled={book.stock <= 0}
          >
            {book.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
          <Button variant="outlined" fullWidth>
            Mua trước trả sau
          </Button>
        </Card>
        <Box mt={2} textAlign="center">
          <div>
            Nhà bán: <b>Bookworm Hà Nội</b>
          </div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Rating value={5} readOnly size="small" />
            <span>(4 đánh giá)</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetail;
