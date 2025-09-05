import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const OrderSummary = ({ cartData }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCartIcon color="primary" />
        Sản phẩm đã đặt ({totalItems} sản phẩm)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cartData.items.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Product Image */}
              <Grid item xs={12} sm={2}>
                <Avatar
                  src={item.image}
                  alt={item.title}
                  variant="rounded"
                  sx={{ 
                    width: { xs: 60, sm: 80 }, 
                    height: { xs: 60, sm: 80 },
                    mx: 'auto'
                  }}
                />
              </Grid>

              {/* Product Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tác giả: {item.author}
                </Typography>
                <Typography variant="body2" color="primary">
                  {formatPrice(item.price)} × {item.quantity}
                </Typography>
              </Grid>

              {/* Quantity and Total */}
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Chip 
                  label={`SL: ${item.quantity}`}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      {/* Coupon Applied */}
      {cartData.coupon && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.50', borderRadius: 1 }}>
          <Typography variant="body2" color="success.dark">
            🎉 Mã giảm giá "{cartData.coupon.code}" đã được áp dụng
            {cartData.coupon.description && ` - ${cartData.coupon.description}`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default OrderSummary;
