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
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// Dummy images
const bookImages = [
  "https://salt.tikicdn.com/cache/750x750/ts/product/8e/7e/7e/2e2b8e6e7e2e4e2e2e2e2e2e2e2e2e2e.jpg",
  "https://salt.tikicdn.com/cache/750x750/ts/product/8e/7e/7e/2e2b8e6e7e2e4e2e2e2e2e2e2e2e2e2e1.jpg",
  "https://salt.tikicdn.com/cache/750x750/ts/product/8e/7e/7e/2e2b8e6e7e2e4e2e2e2e2e2e2e2e2e2e2.jpg",
  "https://salt.tikicdn.com/cache/750x750/ts/product/8e/7e/7e/2e2b8e6e7e2e4e2e2e2e2e2e2e2e2e2e3.jpg",
  "https://salt.tikicdn.com/cache/750x750/ts/product/8e/7e/7e/2e2b8e6e7e2e4e2e2e2e2e2e2e2e2e2e4.jpg",
];

const BookDetail = () => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (val) => {
    if (val < 1) setQuantity(1);
    else if (val > 99) setQuantity(99);
    else setQuantity(val);
  };

  return (
    <Box display="flex" gap={4} p="32px 16px" bgcolor="#fff" minHeight="100vh">
      {/* Left: Images */}
      <Box
        flex="0 0 340px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          src={bookImages[selectedImg]}
          alt="Book Cover"
          width={320}
          height={400}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        <Box display="flex" mt={2}>
          {bookImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              width={56}
              height={56}
              alt={`Book thumb ${idx}`}
              style={{
                border:
                  selectedImg === idx ? "2px solid #1976d2" : "1px solid #eee",
                borderRadius: 4,
                marginRight: 8,
                cursor: "pointer",
              }}
              onClick={() => setSelectedImg(idx)}
            />
          ))}
        </Box>
      </Box>

      {/* Middle: Book Info */}
      <Box flex="1 1 0" maxWidth={520} px={3}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Painting and Reinterpreting the Masters by Sara Lee Roberts
        </Typography>
        <Box mb={1} display="flex" gap={1}>
          <Chip label="FREESHIP XTRA" color="primary" size="small" />
          <Chip label="30 NGÀY ĐỔI TRẢ" color="success" size="small" />
          <Chip label="CHÍNH HÃNG" color="warning" size="small" />
        </Box>
        <Box mb={1}>
          <span>Tác giả: </span>
          <a href="#">Sara Lee Roberts</a>
        </Box>
        <Typography fontSize={28} fontWeight={600} color="#d0011b" mb={1}>
          580.000<sup>đ</sup>
        </Typography>
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
            580.000<sup>đ</sup>
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
          >
            Mua ngay
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartOutlinedIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            Thêm vào giỏ
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
