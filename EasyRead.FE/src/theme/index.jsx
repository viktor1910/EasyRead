import { createTheme } from '@mui/material/styles';
import palette from './palette';

// Customize your theme here
const theme = createTheme({
    palette: palette,
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;