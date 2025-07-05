import { createTheme } from "@mui/material/styles";
import palette from "./palette";

// Customize your theme here
const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "32px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "20px",
      fontWeight: 700,
    },
    h6: {
      fontSize: "16px",
      fontWeight: 700,
    },
    body2: {
      fontSize: "12px",
    },
  },
});

export default theme;
