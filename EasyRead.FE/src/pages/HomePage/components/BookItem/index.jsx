import { Box, Typography, Button, Chip } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const BookItem = ({ 
  book = {
    id: 1,
    title: "Effective TypeScript",
    author: "Dan Vanderkam",
    price: 299000,
    originalPrice: 399000,
    image: "https://salt.tikicdn.com/cache/750x750/ts/product/e2/9e/ed/e1dbece01b595a871eadb52369e3b20c.jpg.webp",
    rating: 4.8,
    discount: 25
  }
}) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleBuyNow = () => {
    // In a real app, this would add to cart and redirect to payment
    navigate('/payment');
  };

  const handleViewDetails = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <Box
      sx={{
        height: "300px",
        width: "236px",
        position: "relative",
        transition:
          "transform 0.3s cubic-bezier(.21,.6,.4,1.02), box-shadow 0.3s",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        zIndex: hovered ? 10 : 1,
        boxShadow: hovered
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          : "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        sx={{
          width: "236px",
          height: "236px",
        }}
        mb={1}
      >
        <img
          src={book.image}
          alt={book.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        
        {/* Discount Badge */}
        {book.discount > 0 && (
          <Chip
            label={`-${book.discount}%`}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontWeight: "bold",
              zIndex: 2
            }}
          />
        )}
        
        {hovered && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "236px",
              height: "300px",
              bgcolor: "rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              borderRadius: "8px",
              transition: "background 0.3s",
              gap: 2
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleBuyNow}
              sx={{ minWidth: 120 }}
            >
              Mua ngay
            </Button>
            <Button
              variant="outlined"
              sx={{ 
                minWidth: 120,
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)"
                }
              }}
              onClick={handleViewDetails}
            >
              Xem chi tiết
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ px: 1 }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          mb={0.5}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {book.author}
        </Typography>
        
        {/* Price */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(book.price)}
          </Typography>
          {book.originalPrice > book.price && (
            <Typography 
              variant="body2" 
              sx={{ 
                textDecoration: "line-through", 
                color: "text.secondary" 
              }}
            >
              {formatPrice(book.originalPrice)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BookItem;
