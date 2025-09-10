import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { useCart } from '../context/CartContext/CartContext';

const CartFlowTest = () => {
  const { cart, loading, error, addToCart, fetchCart } = useCart();
  const [testResults, setTestResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Kiểm tra Authentication',
    'Test Fetch Cart',
    'Test Add to Cart',
    'Kiểm tra CartIcon Update',
    'Test Cart Page'
  ];

  const runTest = async (testName, testFunction) => {
    try {
      setTestResults(prev => [...prev, { name: testName, status: 'running', message: 'Đang chạy...' }]);
      const result = await testFunction();
      setTestResults(prev => [...prev, { name: testName, status: 'success', message: 'Thành công' }]);
      return result;
    } catch (error) {
      setTestResults(prev => [...prev, { name: testName, status: 'error', message: error.message }]);
      return null;
    }
  };

  const testAuthentication = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      throw new Error('Chưa đăng nhập - Token hoặc User không tồn tại');
    }
    
    return { token, user: JSON.parse(user) };
  };

  const testFetchCart = async () => {
    await fetchCart();
    if (error) {
      throw new Error(`Lỗi fetch cart: ${error}`);
    }
    return cart;
  };

  const testAddToCart = async () => {
    const result = await addToCart(1, 1); // Test với book ID 1
    if (!result.success) {
      throw new Error(`Lỗi add to cart: ${result.error}`);
    }
    return result;
  };

  const testCartIconUpdate = () => {
    if (!cart || cart.items_count === 0) {
      throw new Error('CartIcon không được cập nhật - items_count = 0');
    }
    return cart;
  };

  const testCartPage = () => {
    // Simulate navigation to cart page
    if (!cart) {
      throw new Error('Cart page không load được - cart = null');
    }
    return cart;
  };

  const runAllTests = async () => {
    setTestResults([]);
    setCurrentStep(0);

    // Test 1: Authentication
    setCurrentStep(1);
    await runTest('Authentication', testAuthentication);

    // Test 2: Fetch Cart
    setCurrentStep(2);
    await runTest('Fetch Cart', testFetchCart);

    // Test 3: Add to Cart
    setCurrentStep(3);
    await runTest('Add to Cart', testAddToCart);

    // Test 4: CartIcon Update
    setCurrentStep(4);
    await runTest('CartIcon Update', testCartIconUpdate);

    // Test 5: Cart Page
    setCurrentStep(5);
    await runTest('Cart Page', testCartPage);

    setCurrentStep(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'running': return 'info';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2, bgcolor: '#f3e5f5' }}>
      <Typography variant="h6" gutterBottom>
        Cart Flow Test
      </Typography>

      <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={runAllTests}
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Chạy Tất Cả Tests
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setTestResults([])}
        >
          Clear Results
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current State:
        </Typography>
        <Typography variant="body2">
          Loading: {loading ? 'true' : 'false'} | 
          Error: {error || 'null'} | 
          Cart Items: {cart?.items_count || 0}
        </Typography>
      </Box>

      {testResults.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Test Results:
          </Typography>
          {testResults.map((result, index) => (
            <Alert 
              key={index}
              severity={getStatusColor(result.status)}
              sx={{ mb: 1 }}
            >
              <strong>{result.name}:</strong> {result.message}
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CartFlowTest;
