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
  },
});

export default theme;

