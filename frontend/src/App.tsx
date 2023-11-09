import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Footer, Header, LandingPage } from '@features';
import { AuthProvider, MediaQueryProvider } from '@providers';
import { createTheme, ThemeProvider } from '@mui/material';

const customMuiTheme = {
  shape: {
    borderRadius: 50,
  },
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
  },
};

export function App() {
  const muiTheme = createTheme(customMuiTheme);

  return (
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <MediaQueryProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<LandingPage />} />
              {/*<Route path='*' element={<NotFound />} />*/}
            </Routes>
            <Footer />
          </AuthProvider>
        </MediaQueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
