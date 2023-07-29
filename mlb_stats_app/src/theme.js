import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4682B4',
    },
    secondary: {
      main: '#FF4500',
    },
  },
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: 40,
      fontFamily: 'Merriweather Sans',
      letterSpacing: 1,
    },
    h2: {
      fontWeight: 'bold',
      fontSize: 32,
      fontFamily: 'Merriweather Sans',
      letterSpacing: 1,
    },
    h3: {
      fontSize: 24,
      fontFamily: 'Merriweather Sans',
      letterSpacing: 1,
      marginTop: 64,
      marginBottom: 16,
      textDecoration: 'underline',
    },
  },
});

export default theme;

