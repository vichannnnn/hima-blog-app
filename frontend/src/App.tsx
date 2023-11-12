import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider, MediaQueryProvider } from '@providers';
import { createTheme, ThemeProvider } from '@mui/material';
import { CreateBlogPostPage, LoginPage, Footer, Header, LandingPage } from '@features';

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
              <Route path='/login' element={<LoginPage />} />
              <Route path='/create' element={<CreateBlogPostPage />} />
              {/*<Route path='*' element={<NotFound />} />*/}
            </Routes>
            <Footer />
          </AuthProvider>
        </MediaQueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
