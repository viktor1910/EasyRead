import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }) => {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      if (requireAdmin && !isAdmin()) {
        navigate('/');
        return;
      }

      if (requireUser && !isUser() && !isAdmin()) {
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isUser, loading, navigate, requireAdmin, requireUser]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang kiểm tra quyền truy cập...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  if (requireAdmin && !isAdmin()) {
    return null; // Will redirect to home
  }

  if (requireUser && !isUser() && !isAdmin()) {
    return null; // Will redirect to home
  }

  return children;
};

export default ProtectedRoute;
