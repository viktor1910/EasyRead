import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useCart } from '../context/CartContext/CartContext';

const CartDebug = () => {
  const { cart, loading, error } = useCart();

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Cart Debug Info
      </Typography>
      <Box>
        <Typography variant="body2">
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </Typography>
        <Typography variant="body2">
          <strong>Error:</strong> {error || 'null'}
        </Typography>
        <Typography variant="body2">
          <strong>Cart:</strong> {cart ? JSON.stringify(cart, null, 2) : 'null'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartDebug;
