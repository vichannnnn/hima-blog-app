import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider, MediaQueryProvider } from '@providers';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  CreateBlogPostPage,
  LoginPage,
  Footer,
  Header,
  LandingPage,
  UpdateBlogPostPage,
  FullBlogPost,
} from '@features';
import { NotFound } from './features/NotFound/NotFound';

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
              <Route path='/not-found' element={<NotFound />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/create' element={<CreateBlogPostPage />} />
              <Route path='/update/:blog_id' element={<UpdateBlogPostPage />} />
              <Route path='/post/:blog_id' element={<FullBlogPost />} />
              <Route path='*' element={<Navigate to='/not-found' replace />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </MediaQueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
