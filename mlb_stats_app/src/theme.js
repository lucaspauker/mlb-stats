import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#03fc52',
    },
    secondary: {
      main: '#5203fc',
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

