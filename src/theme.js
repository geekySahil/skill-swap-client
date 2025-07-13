import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light', // Light mode
    primary: {
      main: '#0097a7', // Blue accent color
    },
    secondary: {
      main: '#ff9800', // Orange accent color
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#333333', // Dark gray text
      secondary: '#666666', // Medium gray text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Default font family
    h1: {
      fontSize: '2.5rem', // Very large headings
      fontWeight: 600,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem', // Large headings
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.75rem', // Medium headings
      fontWeight: 600,
      color: '#333333',
    },
    h4: {
      fontSize: '1.5rem', // Medium headings
      fontWeight: 600,
      color: '#333333',
    },
    h5: {
      fontSize: '1.25rem', // Normal headings
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontSize: '1rem', // Small headings
      fontWeight: 600,
      color: '#333333',
    },
    body1: {
      fontSize: '1rem', // Body text
      color: '#666666',
    },
    body2: {
      fontSize: '0.875rem', // Smaller body text
      color: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: '8px', // Rounded corners
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px', // Add padding to Paper components
          borderRadius: '8px', // Rounded corners
        },
      },
    },
  },
});

export default theme;
