import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext/AuthContext';

const MyAccountPage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    if (profileError) setProfileError('');
    if (profileSuccess) setProfileSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const result = await updateProfile(profileData.name, profileData.email);
      
      if (result.success) {
        setProfileSuccess(result.message);
      } else {
        setProfileError(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      setProfileError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      
      if (result.success) {
        setPasswordSuccess(result.message);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setPasswordError(result.error || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error) {
      setPasswordError('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear all messages when switching tabs
    setProfileError('');
    setPasswordError('');
    setProfileSuccess('');
    setPasswordSuccess('');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom align="center">
          Tài khoản của tôi
        </Typography>
        
        <Paper elevation={3} sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Thông tin cá nhân" />
            <Tab label="Đổi mật khẩu" />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cập nhật thông tin cá nhân
              </Typography>
              
              {profileError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={() => setProfileError('')}
                >
                  {profileError}
                </Alert>
              )}
              
              {profileSuccess && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 2 }}
                  onClose={() => setProfileSuccess('')}
                >
                  {profileSuccess}
                </Alert>
              )}

              <Box component="form" onSubmit={handleProfileSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Họ và tên"
                  name="name"
                  autoComplete="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={profileLoading}
                >
                  {profileLoading ? <CircularProgress size={24} /> : 'Cập nhật thông tin'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Password Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Đổi mật khẩu
              </Typography>
              
              {passwordError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={() => setPasswordError('')}
                >
                  {passwordError}
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 2 }}
                  onClose={() => setPasswordSuccess('')}
                >
                  {passwordSuccess}
                </Alert>
              )}

              <Box component="form" onSubmit={handlePasswordSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  type="password"
                  id="currentPassword"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? <CircularProgress size={24} /> : 'Đổi mật khẩu'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MyAccountPage;
