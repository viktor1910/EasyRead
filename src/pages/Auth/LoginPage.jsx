import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user starts typing
    if (error) {
      setError("");
    }
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setFieldErrors({ email: "", password: "" });

    // Basic validation
    let hasError = false;
    const newFieldErrors = { email: "", password: "" };

    if (!formData.email) {
      newFieldErrors.email = "Vui lòng nhập email";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Email không hợp lệ";
      hasError = true;
    }

    if (!formData.password) {
      newFieldErrors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    } else if (formData.password.length < 6) {
      newFieldErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      console.log(result);
      if (result.success) {
        // Check if user is admin after login to redirect accordingly
        if (result.user && result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        console.log(result.error);
        setError(result.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.log(error);
      setError(error.message || "Có lỗi xảy ra khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Đăng nhập
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 2, cursor: "pointer" }}
              onClick={() => setError("")}
              title="Click để đóng thông báo"
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Chưa có tài khoản?{" "}
                <Link component={RouterLink} to="/register" variant="body2">
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
