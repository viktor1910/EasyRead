import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AxiosConfig from "../../AxiosConfig";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await AxiosConfig.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const { message, user, token } = response.data;

      if (message === "Login successful") {
        // Lưu user và token thông qua AuthContext
        login(user, token);

        // Redirect dựa trên role
        if (user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
            color="primary"
          >
            Đăng nhập
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Đăng nhập vào tài khoản EasyRead của bạn
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid || loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </Box>

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.href = "/register")}
              >
                Đăng ký ngay
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
