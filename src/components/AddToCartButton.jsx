import React, { useState } from 'react';
import {
  Button,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import axios from '../AxiosConfig';

const AddToCartButton = ({ book, onCartUpdate, disabled = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddToCart = async () => {
    if (!book || quantity <= 0) return;

    setLoading(true);
    try {
      await axios.post('/cart/add', {
        book_id: book.id,
        quantity: quantity
      });

      setSnackbar({
        open: true,
        message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
        severity: 'success'
      });

      // Reset quantity
      setQuantity(1);

      // Notify parent component to update cart
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const isOutOfStock = book?.stock <= 0;
  const maxQuantity = book?.stock || 999;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        {/* Quantity selector */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Giảm số lượng">
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || loading}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
          
          <TextField
            size="small"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              handleQuantityChange(value);
            }}
            inputProps={{ 
              min: 1, 
              max: maxQuantity,
              style: { textAlign: 'center', width: '60px' } 
            }}
            disabled={loading}
          />
          
          <Tooltip title="Tăng số lượng">
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity || loading}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Add to cart button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleAddToCart}
          disabled={loading || disabled || isOutOfStock}
          startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
          sx={{ minWidth: 150 }}
        >
          {loading ? 'Đang thêm...' : isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </Box>

      {/* Stock info */}
      {book?.stock !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Còn lại: {book.stock} sản phẩm
        </Typography>
      )}

      {/* Price info */}
      {book && (
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(book.final_price || book.price || 0)}
        </Typography>
      )}

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddToCartButton;
