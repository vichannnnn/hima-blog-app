import { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AuthProvider, MediaQueryProvider } from '@providers';
import '../app/globals.css';

const customMuiTheme = {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          cursor: 'pointer',
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'PatrickHandSC, sans-serif',
          fontSize: '24px',
          backgroundColor: '#fcfbf8',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fcfbf8',
          borderRadius: '24px',
        },
      },
    },
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const muiTheme = createTheme(customMuiTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <MediaQueryProvider>
        <AuthProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </MediaQueryProvider>
    </ThemeProvider>
  );
}

export default MyApp;
