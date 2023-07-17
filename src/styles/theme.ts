import { createTheme } from '@mui/material';

export const appPallete = {
  50: '#FAF5FF',
  100: '#E9D8FD',
  200: '#D6BCFA',
  300: '#B794F4',
  400: '#9F7AEA',

  500: '#6F6AF8',
  600: '#6B46C1',
  700: '#553C9A',
  800: '#44337A',
  900: '#322659'
};

export const theme = createTheme({
  palette: {
    primary: {
      main: appPallete[500],
      light: appPallete[50]
    },
    error: {
      main: '#E53E3E',
      light: '#FC8181'
    },
    warning: {
      main: '#ECC94B',
      light: '#FAF089'
    },
    success: {
      main: '#38A169',
      light: '#68D391'
    },
    secondary: {
      main: '#A0AEC0'
    }
  }
});
