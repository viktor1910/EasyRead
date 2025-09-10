import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppRouter from "./Router.jsx";
import { QueryProvider } from "./context/QueryProvider";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { CartProvider } from "./context/CartContext/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
