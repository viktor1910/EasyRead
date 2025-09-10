import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Component để bảo vệ các trang không cần authentication
 * Ví dụ: trang login, register - nếu user đã đăng nhập thì redirect về trang chủ
 */
const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      // Nếu đã đăng nhập, redirect dựa trên role
      if (user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = redirectTo;
      }
    }
  }, [isAuthenticated, user, redirectTo]);

  // Nếu chưa đăng nhập, hiển thị component
  if (!isAuthenticated()) {
    return children;
  }

  // Nếu đã đăng nhập, hiển thị loading trong khi redirect
  return <div>Redirecting...</div>;
};

export default PublicRoute;
