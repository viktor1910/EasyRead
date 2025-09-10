import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useCart } from '../context/CartContext/CartContext';

const CartTest = () => {
  const { cart, loading, error, addToCart, fetchCart } = useCart();

  const handleTestAddToCart = async () => {
    console.log('Testing add to cart...');
    const result = await addToCart(1, 1); // Test với book ID 1
    console.log('Add to cart result:', result);
  };

  const handleTestFetchCart = () => {
    console.log('Testing fetch cart...');
    fetchCart();
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
      <Typography variant="h6" gutterBottom>
        Cart Test Component
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </Typography>
        <Typography variant="body2">
          <strong>Error:</strong> {error || 'null'}
        </Typography>
        <Typography variant="body2">
          <strong>Cart Items Count:</strong> {cart?.items_count || 0}
        </Typography>
        <Typography variant="body2">
          <strong>Cart Subtotal:</strong> {cart?.subtotal || 0}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleTestAddToCart}
          disabled={loading}
        >
          Test Add to Cart
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleTestFetchCart}
          disabled={loading}
        >
          Test Fetch Cart
        </Button>
      </Box>
    </Paper>
  );
};

export default CartTest;
