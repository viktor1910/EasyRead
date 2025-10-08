import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token trong localStorage khi component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      // Backend trả về { message, user, token }
      if (response.user && response.token) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          role: response.user.role,
        };

        setUser(userData);
        setToken(response.token);

        // Lưu vào localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: response.message || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error types
      let errorMessage = "Đăng nhập thất bại";

      if (error.response) {
        // Server responded with error
        const { status, data } = error.response;

        if (status === 401) {
          errorMessage = data.error || data.message || "Email hoặc mật khẩu không đúng";
        } else if (status === 400) {
          errorMessage = data.error || data.message || "Thông tin đăng nhập không hợp lệ";
        } else if (status === 404) {
          errorMessage = "Không tìm thấy tài khoản";
        } else if (status >= 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        } else {
          errorMessage = data.error || data.message || error.message;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Không thể kết nối đến server";
      } else {
        // Something else happened
        errorMessage = error.message || "Có lỗi xảy ra";
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, email, password, firstName, lastName) => {
    try {
      const response = await authAPI.register({
        name: `${firstName} ${lastName}`,
        email,
        password,
        password_confirmation: password,
        role: "user",
      });

      // Backend trả về { message, user, token }
      if (response.user && response.token) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          role: response.user.role,
        };

        setUser(userData);
        setToken(response.token);

        // Lưu vào localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: response.message || "Đăng ký thất bại",
        };
      }
    } catch (error) {
      // Handle API error response
      if (error.response?.data?.errors) {
        return {
          success: false,
          error: error.response.data.message || "Đăng ký thất bại",
          errors: error.response.data.errors
        };
      }
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  // Các hàm updateProfile và changePassword không có trong backend
  // Có thể implement sau khi backend có các endpoint này

  const logout = async () => {
    try {
      // Gọi API logout để xóa token trên server
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Luôn xóa token và user khỏi frontend
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isUser = () => {
    return user?.role === "user" || user?.role === "admin";
  };

  // Helper function to get headers with auth token
  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
