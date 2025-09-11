import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, severity = "info", duration = 6000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      duration,
      open: true,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, duration);
  };

  const hideNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const showError = (error, duration = 8000) => {
    let message = "Có lỗi xảy ra";

    if (typeof error === "string") {
      message = error;
    } else if (error?.response?.data) {
      const data = error.response.data;

      // Handle validation errors with specific field messages
      if (data.errors && typeof data.errors === "object") {
        const errorMessages = [];
        Object.entries(data.errors).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((msg) => errorMessages.push(msg));
          } else if (typeof fieldErrors === "string") {
            errorMessages.push(fieldErrors);
          }
        });
        message = errorMessages.join(", ");
      } else if (data.message) {
        message = data.message;
      }
    } else if (error?.message) {
      message = error.message;
    }

    showNotification(message, "error", duration);
  };

  const showSuccess = (message, duration = 4000) => {
    showNotification(message, "success", duration);
  };

  const showWarning = (message, duration = 6000) => {
    showNotification(message, "warning", duration);
  };

  const showInfo = (message, duration = 6000) => {
    showNotification(message, "info", duration);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showError,
        showSuccess,
        showWarning,
        showInfo,
        hideNotification,
      }}
    >
      {children}

      {/* Render all notifications */}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={notification.duration}
          onClose={() => hideNotification(notification.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ mt: notification.id === notifications[0]?.id ? 0 : 7 }}
        >
          <Alert
            onClose={() => hideNotification(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
