import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';

const SimpleRegisterTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing register...');
      
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`, // Unique email
          password: 'password123',
          password_confirmation: 'password123'
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setResult({ success: true, data });
      } else {
        setResult({ success: false, error: data });
      }
    } catch (error) {
      console.error('Register error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing backend connection...');
      
      const response = await fetch('http://localhost:8000/api/books', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        setResult({ success: true, message: 'Backend is running!' });
      } else {
        setResult({ success: false, error: `Backend error: ${response.status}` });
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      setResult({ success: false, error: `Cannot connect to backend: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2, bgcolor: '#e8f5e8' }}>
      <Typography variant="h6" gutterBottom>
        Simple Register Test
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={testBackendConnection}
          disabled={loading}
        >
          Test Backend Connection
        </Button>
        <Button
          variant="contained"
          onClick={testRegister}
          disabled={loading}
        >
          Test Register
        </Button>
      </Box>

      {result && (
        <Box>
          {result.success ? (
            <Alert severity="success">
              <Typography variant="subtitle2">Success!</Typography>
              <Typography variant="body2">
                {result.message || 'Register successful'}
              </Typography>
              {result.data && (
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', mt: 1 }}>
                  {JSON.stringify(result.data, null, 2)}
                </Typography>
              )}
            </Alert>
          ) : (
            <Alert severity="error">
              <Typography variant="subtitle2">Error!</Typography>
              <Typography variant="body2">
                {typeof result.error === 'string' ? result.error : JSON.stringify(result.error)}
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Debug Steps:
        </Typography>
        <Typography variant="body2">
          1. Click "Test Backend Connection" first
        </Typography>
        <Typography variant="body2">
          2. If backend is running, click "Test Register"
        </Typography>
        <Typography variant="body2">
          3. Check console logs for detailed info
        </Typography>
      </Box>
    </Paper>
  );
};

export default SimpleRegisterTest;
